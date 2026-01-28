// Python Error Types and Parsing

export interface PythonError {
  type: string;
  message: string;
  traceback: string[];
  line?: number;
  column?: number;
}

export function parsePythonError(error: Error): PythonError {
  const errorMessage = error.message || String(error);
  const traceback: string[] = [];

  // Parse common Python error patterns
  const lines = errorMessage.split('\n');

  let errorType = 'Error';
  let errorMessageMain = errorMessage;
  let line: number | undefined;
  let column: number | undefined;

  // Extract traceback
  for (const line_str of lines) {
    if (line_str.includes('File "<exec>"')) {
      traceback.push(line_str.trim());
      // Extract line number
      const lineMatch = line_str.match(/line (\d+)/);
      if (lineMatch) {
        line = parseInt(lineMatch[1], 10);
      }
    }
  }

  // Extract error type and message
  const lastLine = lines[lines.length - 1] || '';
  const errorMatch = lastLine.match(/^(\w+Error):\s*(.+)$/);
  if (errorMatch) {
    errorType = errorMatch[1];
    errorMessageMain = errorMatch[2];
  }

  return {
    type: errorType,
    message: errorMessageMain,
    traceback,
    line,
    column,
  };
}

export function formatPythonError(error: PythonError): string {
  const parts = [error.type, error.message];

  if (error.line !== undefined) {
    parts.push(`(line ${error.line})`);
  }

  return parts.join(': ');
}

export const PYTHON_ERROR_MESSAGES: Record<string, string> = {
  'SyntaxError': 'There is a syntax error in your code. Check for missing colons, quotes, or parentheses.',
  'IndentationError': 'Python uses indentation to group code. Check that your code is properly indented.',
  'NameError': 'A variable or function name is not defined. Check for typos.',
  'TypeError': 'An operation was applied to the wrong type. Check your data types.',
  'ValueError': 'A function received an argument with the right type but inappropriate value.',
  'AttributeError': 'An object does not have the attribute or method you are trying to access.',
  'IndexError': 'You are trying to access an index that is out of range.',
  'KeyError': 'The key you are looking for does not exist in the dictionary.',
  'ZeroDivisionError': 'You cannot divide by zero.',
  'ImportError': 'The module or package you are trying to import does not exist.',
  'RuntimeError': 'An error occurred during execution.',
};

export function getHelpfulMessage(error: PythonError): string | undefined {
  return PYTHON_ERROR_MESSAGES[error.type];
}
