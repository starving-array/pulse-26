process.env.NODE_ENV = "test";
import test from "node:test";
import assert from "node:assert";

interface MockResponse {
  statusCode?: number;
  jsonData?: Record<string, unknown>;
  sendData?: string;
  status: (code: number) => MockResponse;
  json: (data: Record<string, unknown>) => MockResponse;
  send: (msg: string) => MockResponse;
  setHeader: (name: string, value: string) => MockResponse;
}

const makeMockRes = (): MockResponse => {
  const res = {} as MockResponse;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: Record<string, unknown>) => {
    res.jsonData = data;
    return res;
  };
  res.send = (msg: string) => {
    res.sendData = msg;
    return res;
  };
  res.setHeader = () => res;
  return res;
};

interface ExpressRouterLayer {
  route?: {
    path: string;
    stack: Array<{
      handle: (req: unknown, res: unknown) => Promise<void>;
    }>;
  };
}

interface ExpressApp {
  _router: {
    stack: ExpressRouterLayer[];
  };
}

test("Telemetry Engine - Status Level Classification", async () => {
  const { getStatusLevel } = await import("./server");

  // Scenario 1: Balanced flow below alert limits (ACTIVE)
  assert.strictEqual(getStatusLevel(30, 35, "Normal"), "ACTIVE");

  // Scenario 2: Gate C density at warning threshold (WARNING)
  assert.strictEqual(getStatusLevel(85, 35, "Normal"), "WARNING");

  // Scenario 3: Gate C density at critical threshold (CRITICAL)
  assert.strictEqual(getStatusLevel(92, 35, "Normal"), "CRITICAL");

  // Scenario 4: Metro hub surge lockdown forces stadium lockdown (CRITICAL)
  assert.strictEqual(getStatusLevel(15, 20, "Zero-Flow Lockdown"), "CRITICAL");

  // Scenario 5: Both gates congested (CRITICAL)
  assert.strictEqual(getStatusLevel(85, 85, "Normal"), "CRITICAL");

  // Scenario 6: High disparity, Gate C busy (DIVERT_PROACTIVE)
  assert.strictEqual(getStatusLevel(65, 20, "Normal"), "DIVERT_PROACTIVE");

  // Scenario 7: High disparity, Gate D busy (DIVERT_PROACTIVE)
  assert.strictEqual(getStatusLevel(20, 65, "Normal"), "DIVERT_PROACTIVE");
});

test("Express Endpoint - Parameter Bounding & Validation Guards", async () => {
  const { default: appModule } = await import("./server");
  const app = appModule as unknown as ExpressApp;
  
  const layer = app._router.stack.find(
    (l) => l.route !== undefined && l.route.path === "/api/analyze-telemetry"
  );
  if (!layer || !layer.route) {
    throw new Error("Target endpoint route handler not found in router stack.");
  }
  const handler = layer.route.stack[0].handle;

  // Test Case a: Out-of-bounds metrics (negative values)
  const req1 = {
    body: {
      gateCDensity: -10,
      gateDDensity: 50,
      surgeRate: "Normal",
      fanContext: "Standard Ingress"
    },
    ip: "127.0.0.1",
    headers: {}
  };
  const res1 = makeMockRes();
  await handler(req1, res1);
  assert.strictEqual(res1.statusCode, 400);
  assert.match(String(res1.jsonData?.error || ""), /between 0 and 100/);

  // Test Case b: Out-of-bounds metrics (> 100)
  const req2 = {
    body: {
      gateCDensity: 105,
      gateDDensity: 50,
      surgeRate: "Normal",
      fanContext: "Standard Ingress"
    },
    ip: "127.0.0.1",
    headers: {}
  };
  const res2 = makeMockRes();
  await handler(req2, res2);
  assert.strictEqual(res2.statusCode, 400);
  assert.match(String(res2.jsonData?.error || ""), /between 0 and 100/);

  // Test Case c: Invalid data types (null value)
  const req3 = {
    body: {
      gateCDensity: null,
      gateDDensity: 50,
      surgeRate: "Normal",
      fanContext: "Standard Ingress"
    },
    ip: "127.0.0.1",
    headers: {}
  };
  const res3 = makeMockRes();
  await handler(req3, res3);
  assert.strictEqual(res3.statusCode, 400);
  assert.match(String(res3.jsonData?.error || ""), /Missing required/);
});

test("Express Endpoint - Business Rules & Cache Integration", async () => {
  const { default: appModule } = await import("./server");
  const app = appModule as unknown as ExpressApp;
  
  const layer = app._router.stack.find(
    (l) => l.route !== undefined && l.route.path === "/api/analyze-telemetry"
  );
  if (!layer || !layer.route) {
    throw new Error("Target endpoint route handler not found in router stack.");
  }
  const handler = layer.route.stack[0].handle;

  // Test Case A: DIVERT_PROACTIVE reasoning branch
  const reqDivert = {
    body: {
      gateCDensity: 65,
      gateDDensity: 20,
      surgeRate: "Normal",
      fanContext: "Standard Ingress"
    },
    ip: "127.0.0.1",
    headers: {}
  };
  const resDivert = makeMockRes();
  await handler(reqDivert, resDivert);
  assert.strictEqual(resDivert.jsonData?.status_level, "DIVERT_PROACTIVE");
  assert.strictEqual(resDivert.jsonData?.target_reroute_gate, "Gate D");

  // Test Case B: Zero-Flow Lockdown override
  const reqLockdown = {
    body: {
      gateCDensity: 15,
      gateDDensity: 20,
      surgeRate: "Zero-Flow Lockdown",
      fanContext: "Standard Ingress"
    },
    ip: "127.0.0.1",
    headers: {}
  };
  const resLockdown = makeMockRes();
  await handler(reqLockdown, resLockdown);
  assert.strictEqual(resLockdown.jsonData?.status_level, "CRITICAL");
  assert.strictEqual(resLockdown.jsonData?.target_reroute_gate, "NONE (LOCKDOWN)");

  // Test Case C: Caching (Consecutive Identical Requests)
  const reqCache = {
    body: {
      gateCDensity: 45,
      gateDDensity: 40,
      surgeRate: "Normal",
      fanContext: "Unique-Cache-Test"
    },
    ip: "127.0.0.2",
    headers: {}
  };

  // First request (Cache MISS)
  const resCache1 = makeMockRes();
  await handler(reqCache, resCache1);
  assert.strictEqual(resCache1.jsonData?.cache_status, "MISS");

  // Second request (Cache HIT)
  const resCache2 = makeMockRes();
  await handler(reqCache, resCache2);
  assert.strictEqual(resCache2.jsonData?.cache_status, "HIT");
});
