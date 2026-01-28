// Pyodide Execution Engine (Main Thread)
// Uses a simple web worker without Comlink to avoid webpack issues

export interface ExecutionOptions {
  timeout?: number;
  captureOutput?: boolean;
}

export interface ExecuteResult {
  success: boolean;
  output: string;
  error: string | null;
  traceback: string | null;
  executionTime: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error: string | null;
  output: string;
}

export interface RunTestsResult {
  passed: boolean;
  results: TestResult[];
}

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;
let messageId = 0;
const pendingMessages = new Map<number, { resolve: (value: any) => void; reject: (error: any) => void }>();

function getWorker(): Worker {
  if (!worker) {
    // Create worker from the public directory
    worker = new Worker('/pyodide-worker.js', { type: 'module' });

    worker.addEventListener('message', (event) => {
      const { id, result, error } = event.data;
      const pending = pendingMessages.get(id);
      if (pending) {
        pendingMessages.delete(id);
        if (error) {
          pending.reject(new Error(error));
        } else {
          pending.resolve(result);
        }
      }
    });

    worker.addEventListener('error', (error) => {
      console.error('Worker error:', error);
    });
  }
  return worker;
}

function workerCall<T>(method: string, args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    pendingMessages.set(id, { resolve, reject });
    getWorker().postMessage({ id, method, args });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (pendingMessages.has(id)) {
        pendingMessages.delete(id);
        reject(new Error('Worker call timeout'));
      }
    }, 30000);
  });
}

export async function initializePythonRuntime(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = workerCall('initialize', []);
  return initPromise;
}

export async function executePython(
  code: string,
  options: ExecutionOptions = {}
): Promise<ExecuteResult> {
  // Ensure runtime is initialized
  const isInit = await workerCall('isInitialized', []);
  if (!isInit) {
    await initializePythonRuntime();
  }

  return workerCall<ExecuteResult>('execute', [code, options]);
}

export async function runPythonTests(
  code: string,
  tests: Array<{ name: string; code: string }>
): Promise<RunTestsResult> {
  // Ensure runtime is initialized
  const isInit = await workerCall('isInitialized', []);
  if (!isInit) {
    await initializePythonRuntime();
  }

  return workerCall<RunTestsResult>('runTests', [code, tests]);
}

export async function resetPythonRuntime(): Promise<void> {
  const isInit = await workerCall('isInitialized', []);
  if (isInit) {
    return workerCall('reset', []);
  }
}

export function isPythonRuntimeInitialized(): boolean {
  return worker !== null;
}

export async function checkWebAssemblySupport(): Promise<boolean> {
  try {
    return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
  } catch {
    return false;
  }
}

export type { ExecuteResult, TestResult, RunTestsResult, ExecutionOptions };
