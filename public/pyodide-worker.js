// Pyodide Web Worker with comprehensive error handling and debugging
// This file runs in a Web Worker and loads Pyodide from CDN

// Logging function
function log(message, level = 'info') {
  console.log(`[PyodideWorker ${level.toUpperCase()}]`, message);
}

// Define the worker API with detailed error tracking
const PyodideWorker = {
  pyodide: null,
  outputBuffer: [],
  initializationState: 'idle', // idle, loading, ready, error
  initializationError: null,

  async initialize() {
    log('Starting Pyodide initialization...', 'info');
    this.initializationState = 'loading';
    this.initializationError = null;

    if (this.pyodide) {
      log('Pyodide already initialized', 'info');
      this.initializationState = 'ready';
      return;
    }

    try {
      log('Loading Pyodide from CDN...', 'info');
      // In a Web Worker, we need to use importScripts for Pyodide
      // First load the main script
      self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js');
      log('Pyodide script loaded via importScripts', 'info');

      // Now loadPyodide should be available globally
      if (typeof self.loadPyodide !== 'function') {
        throw new Error('loadPyodide is not available after importScripts');
      }
      log('loadPyodide function is available', 'info');

      this.pyodide = await self.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/',
      });
      log('Pyodide initialized successfully', 'info');

      // Set up output capture - use raw string format for Pyodide 0.29
      // The callback receives text directly
      this.pyodide.setStdout({ batched: (str) => {
        if (str) {
          this.outputBuffer.push(str);
          log(`stdout: ${str.substring(0, 50)}${str.length > 50 ? '...' : ''}`, 'debug');
        }
      } });

      this.pyodide.setStderr({ batched: (str) => {
        if (str) {
          this.outputBuffer.push(`[stderr] ${str}`);
          log(`stderr: ${str.substring(0, 50)}${str.length > 50 ? '...' : ''}`, 'warn');
        }
      } });

      this.initializationState = 'ready';
      log('Pyodide ready!', 'info');
    } catch (error) {
      const errorMsg = error.message || String(error);
      log(`Pyodide initialization failed: ${errorMsg}`, 'error');
      this.initializationState = 'error';
      this.initializationError = errorMsg;
      throw error;
    }
  },

  async execute(code, options = {}) {
    log(`Executing code (${code.length} chars)`, 'info');

    if (!this.pyodide) {
      log('Execute called but pyodide is null', 'error');
      return {
        success: false,
        output: '',
        error: 'Pyodide not initialized',
        traceback: null,
        executionTime: 0,
        debug: { state: this.initializationState, error: this.initializationError },
      };
    }

    if (this.initializationState !== 'ready') {
      log(`Execute called but state is: ${this.initializationState}`, 'warn');
      return {
        success: false,
        output: '',
        error: `Pyodide not ready (state: ${this.initializationState})`,
        traceback: null,
        executionTime: 0,
        debug: { state: this.initializationState, error: this.initializationError },
      };
    }

    const startTime = performance.now();
    this.outputBuffer = [];
    log('Starting code execution...', 'debug');

    try {
      // Run the code
      this.pyodide.runPython(code);
      log('Code executed successfully', 'debug');

      // Flush stdout/stderr to ensure all callbacks are invoked
      try {
        this.pyodide.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()');
      } catch (e) {
        log(`Flush failed (non-critical): ${e.message}`, 'debug');
      }

      const executionTime = performance.now() - startTime;

      // Capture any print output
      let output = this.outputBuffer.join('\n').trim();
      log(`Captured output: ${output.length} chars`, 'debug');

      // Try to get the last expression result if no explicit print
      if (!output) {
        try {
          const lastResult = this.pyodide.runPython('_');
          if (lastResult !== undefined && lastResult !== null) {
            output = String(lastResult);
            log(`Got last expression result: ${output.substring(0, 50)}...`, 'debug');
          }
        } catch (e) {
          log(`No last expression result: ${e.message}`, 'debug');
        }
      }

      log(`Execution successful in ${executionTime.toFixed(2)}ms`, 'info');
      return {
        success: true,
        output,
        error: null,
        traceback: null,
        executionTime,
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      const errorMessage = error.message || String(error);
      log(`Code execution failed: ${errorMessage}`, 'error');

      // Try to extract more error info
      let traceback = '';
      if (error.traceback) {
        traceback = error.traceback;
        log(`Traceback: ${traceback.substring(0, 200)}...`, 'debug');
      }

      return {
        success: false,
        output: this.outputBuffer.join('\n'),
        error: errorMessage,
        traceback,
        executionTime,
      };
    }
  },

  async runTests(code, tests) {
    log(`Running ${tests.length} tests on code (${code.length} chars)`, 'info');

    if (!this.pyodide) {
      log('runTests called but pyodide is null', 'error');
      throw new Error('Pyodide not initialized');
    }

    const results = [];

    // First, run the user code
    log('Running user code...', 'debug');
    try {
      this.pyodide.runPython(code);
      log('User code executed', 'debug');
    } catch (error) {
      log(`User code execution failed: ${error.message}`, 'error');
      throw new Error(`Code execution failed: ${error.message}`);
    }

    // Run each test
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      log(`Running test ${i + 1}/${tests.length}: ${test.name}`, 'debug');

      try {
        this.pyodide.runPython(test.code);
        results.push({
          name: test.name,
          passed: true,
          error: null,
          output: '',
        });
        log(`Test "${test.name}" passed`, 'debug');
      } catch (error) {
        const errorMsg = error.message || String(error);
        log(`Test "${test.name}" failed: ${errorMsg}`, 'debug');
        results.push({
          name: test.name,
          passed: false,
          error: errorMsg,
          output: error.traceback || '',
        });
      }
    }

    const passedCount = results.filter((r) => r.passed).length;
    log(`Tests complete: ${passedCount}/${results.length} passed`, 'info');

    return { passed: passedCount === results.length, results };
  },

  async reset() {
    log('Resetting Python namespace', 'info');
    if (this.pyodide) {
      try {
        // Clear the namespace
        const resetCode = `
for name in list(globals().keys()):
  if not name.startswith("__"):
    del globals()[name]
`;
        this.pyodide.runPython(resetCode);
        log('Namespace reset complete', 'debug');
      } catch (error) {
        log(`Reset error: ${error.message}`, 'error');
      }
    }
    this.outputBuffer = [];
  },

  isInitialized() {
    return this.pyodide !== null && this.initializationState === 'ready';
  },

  getDebugInfo() {
    return {
      initializationState: this.initializationState,
      initializationError: this.initializationError,
      isInitialized: this.isInitialized(),
      pyodideExists: this.pyodide !== null,
      outputBufferSize: this.outputBuffer.length,
    };
  },
};

// Listen for messages from main thread
self.addEventListener('message', async (event) => {
  const { id, method, args } = event.data;

  log(`Received message: id=${id}, method=${method}, args.length=${args.length}`, 'debug');

  try {
    const result = await PyodideWorker[method](...args);
    log(`Method ${method} completed successfully`, 'debug');
    self.postMessage({ id, result, debug: PyodideWorker.getDebugInfo() });
  } catch (error) {
    const errorMsg = error.message || String(error);
    log(`Method ${method} failed: ${errorMsg}`, 'error');
    self.postMessage({ id, error: errorMsg, debug: PyodideWorker.getDebugInfo() });
  }
});
