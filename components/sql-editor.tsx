'use client';

import { useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function SQLEditor({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = '-- Enter your SQL query here',
}: SQLEditorProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSubmit?.();
      }
    },
    [onSubmit]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900" data-testid="sql-editor">
      <CodeMirror
        value={value}
        height="200px"
        minHeight="150px"
        extensions={disabled ? [] : [sql()]}
        theme={oneDark}
        onChange={disabled ? undefined : (val) => {
          console.log('[SQLEditor] onChange - raw val:', `"${val}"`);
          console.log('[SQLEditor] onChange - char codes:', Array.from(val).map(c => `${c}(${c.charCodeAt(0)})`).join(' '));
          console.log('[SQLEditor] onChange - reversed:', Array.from(val).reverse().join(''));
          onChange(val);
        }}
        placeholder={placeholder}
        editable={!disabled}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
      <div className="flex flex-col sm:flex-row gap-2 p-2 sm:p-3 bg-zinc-800 border-t border-zinc-700">
        <button
          onClick={() => {
            console.log('[SQLEditor] Run Query clicked - value:', `"${value}"`);
            console.log('[SQLEditor] Run Query clicked - char codes:', Array.from(value).map(c => `${c}(${c.charCodeAt(0)})`).join(' '));
            onSubmit?.();
          }}
          disabled={disabled || !value.trim()}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed rounded-md text-white font-medium text-sm transition-colors"
          data-testid="run-query-btn"
        >
          Run Query
          <span className="hidden sm:inline ml-2 text-zinc-300 text-xs">(Ctrl+Enter)</span>
        </button>
        <button
          onClick={() => onChange('')}
          disabled={disabled}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-md text-white text-sm transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
