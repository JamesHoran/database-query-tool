// Pyodide Web Worker
// This file runs in a Web Worker and loads Pyodide from CDN

// Define the worker API
const PyodideWorker = {
  pyodide: null,
  outputBuffer: [],

  async initialize() {
    if (this.pyodide) return;

    // Load Pyodide from CDN
    const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js');

    this.pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/',
    });

    // Set up output capture
    this.pyodide.setStdout({
      batched: (str) => {
        this.outputBuffer.push(str);
      },
    });

    this.pyodide.setStderr({
      batched: (str) => {
        this.outputBuffer.push(`[stderr] ${str}`);
      },
    });
  },

  async execute(code, options = {}) {
    if (!this.pyodide) {
      return {
        success: false,
        output: '',
        error: 'Pyodide not initialized',
        traceback: null,
        executionTime: 0,
      };
    }

    const startTime = performance.now();
    this.outputBuffer = [];

    try {
      // Clear previous output
      this.outputBuffer = [];

      // Run the code
      this.pyodide.runPython(code);

      const executionTime = performance.now() - startTime;

      // Capture any print output
      let output = this.outputBuffer.join('\n');

      // Try to get the last expression result if no explicit print
      if (!output) {
        try {
          const lastResult = this.pyodide.runPython('_');
          if (lastResult !== undefined && lastResult !== null) {
            output = String(lastResult);
          }
        } catch {
          // No last expression
        }
      }

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

      return {
        success: false,
        output: this.outputBuffer.join('\n'),
        error: errorMessage,
        traceback: error.traceback || errorMessage,
        executionTime,
      };
    }
  },

  async runTests(code, tests) {
    if (!this.pyodide) {
      throw new Error('Pyodide not initialized');
    }

    const results = [];

    // First, run the user code
    try {
      this.pyodide.runPython(code);
    } catch (error) {
      throw new Error(`Code execution failed: ${error.message}`);
    }

    // Run each test
    for (const test of tests) {
      try {
        this.pyodide.runPython(test.code);
        results.push({
          name: test.name,
          passed: true,
          error: null,
          output: '',
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          error: error.message || String(error),
          output: error.traceback || '',
        });
      }
    }

    const passed = results.every((r) => r.passed);

    return { passed, results };
  },

  async reset() {
    if (this.pyodide) {
      // Clear the namespace
      const resetCode = `
for name in list(globals().keys()):
  if not name.startswith("__"):
    del globals()[name]
`;
      this.pyodide.runPython(resetCode);
    }
    this.outputBuffer = [];
  },

  isInitialized() {
    return this.pyodide !== null;
  },
};

// Listen for messages from main thread
self.addEventListener('message', async (event) => {
  const { id, method, args } = event.data;

  try {
    const result = await PyodideWorker[method](...args);
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
});
