'use client';

import { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard';

interface PythonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  showMobileToolbar?: boolean;
  readOnly?: boolean;
}

export function PythonEditor({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = '# Write your Python code here',
  minHeight = 200,
  maxHeight = 400,
  showMobileToolbar = true,
  readOnly = false,
}: PythonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isOpen: keyboardOpen, insertChar, pythonSymbols } = useMobileKeyboard();

  const extensions = [
    python(),
    oneDark,
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const handleSymbolClick = (char: string) => {
    const textarea = document.querySelector('.cm-content') as HTMLTextAreaElement;
    if (textarea) {
      // Find the focused CodeMirror instance
      const cmElement = document.querySelector('.cm-editor');
      if (cmElement) {
        // For CodeMirror 6, we need to dispatch keyboard events or use the API
        // This is a simplified approach - for production, you'd use the CM6 API
        const event = new KeyboardEvent('keydown', {
          key: char,
          bubbles: true,
        });
        cmElement.dispatchEvent(event);
      }
    }
  };

  return (
    <div
      className={`python-editor ${keyboardOpen ? 'keyboard-open' : ''}`}
      style={{ minHeight, maxHeight }}
    >
      {showMobileToolbar && (
        <div className="mobile-toolbar flex flex-wrap gap-1 p-2 bg-zinc-800 border-b border-zinc-700">
          {pythonSymbols.map((symbol) => (
            <button
              key={symbol.char}
              type="button"
              onClick={() => {
                // Insert at cursor position by modifying the value
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  // Simple approach - append to end for now
                  // In production, use CodeMirror's transaction API
                  onChange(value + symbol.char);
                }
              }}
              className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-200 text-sm font-mono transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title={symbol.name}
              aria-label={symbol.name}
              disabled={disabled || readOnly}
            >
              {symbol.label}
            </button>
          ))}
        </div>
      )}

      <div className="editor-wrapper">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={extensions}
          height={`${minHeight}px`}
          maxHeight={`${maxHeight}px`}
          editable={!disabled && !readOnly}
          placeholder={placeholder}
          className="text-sm"
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800 border-t border-zinc-700 text-xs text-zinc-500">
        <span>Python 3</span>
        {onSubmit && (
          <span className="text-zinc-600">
            Ctrl+Enter to run
          </span>
        )}
      </div>

      <style jsx>{`
        .python-editor :global(.cm-editor) {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
        }
        .python-editor :global(.cm-content) {
          padding: 12px;
          min-height: ${minHeight}px;
        }
        .python-editor :global(.cm-focused) {
          outline: none;
        }
        .python-editor :global(.cm-scroller) {
          overflow: auto;
        }
        .python-editor.keyboard-open :global(.cm-scroller) {
          max-height: ${keyboardOpen ? '30vh' : `${maxHeight}px`};
        }
        @media (max-width: 768px) {
          .python-editor :global(.cm-content) {
            font-size: 13px;
            padding: 8px;
          }
          .mobile-toolbar {
            gap: 0.5rem;
          }
          .mobile-toolbar button {
            min-width: 40px;
            min-height: 40px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
