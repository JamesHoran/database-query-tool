'use client';

import { useState } from 'react';
import { PythonEditor } from './python-editor';
import { PythonConsole } from './python-console';
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard';

interface MobileCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  output: string;
  error: string | null;
  isRunning?: boolean;
  executionTime?: number;
  onRun: () => void;
  onReset: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function MobileCodeEditor({
  value,
  onChange,
  output,
  error,
  isRunning = false,
  executionTime = 0,
  onRun,
  onReset,
  placeholder,
  readOnly = false,
}: MobileCodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'output'>('code');
  const { isOpen: keyboardOpen } = useMobileKeyboard();

  return (
    <div className="mobile-code-editor flex flex-col h-full">
      {/* Tab Headers */}
      <div className="flex border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'code'
              ? 'text-blue-400 bg-zinc-900 border-b-2 border-blue-500'
              : 'text-zinc-500 hover:text-zinc-400'
          }`}
          aria-selected={activeTab === 'code'}
          role="tab"
        >
          Code
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('output')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'output'
              ? 'text-blue-400 bg-zinc-900 border-b-2 border-blue-500'
              : 'text-zinc-500 hover:text-zinc-400'
          }`}
          aria-selected={activeTab === 'output'}
          role="tab"
        >
          Output
          {error && (
            <span className="ml-1 w-2 h-2 rounded-full bg-red-500 inline-block" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' ? (
          <div className="h-full">
            <PythonEditor
              value={value}
              onChange={onChange}
              onSubmit={onRun}
              placeholder={placeholder}
              minHeight={keyboardOpen ? 150 : 250}
              maxHeight={keyboardOpen ? 200 : 400}
              showMobileToolbar={true}
              readOnly={readOnly}
            />
          </div>
        ) : (
          <div className="h-full p-4">
            <PythonConsole
              output={output}
              error={error}
              executionTime={executionTime}
              isRunning={isRunning}
            />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center gap-2 p-3 bg-zinc-900 border-t border-zinc-800 safe-area-bottom">
        <button
          type="button"
          onClick={onReset}
          disabled={isRunning}
          className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-850 disabled:text-zinc-600 text-zinc-300 rounded-lg font-medium transition-colors min-h-[48px]"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning || !value.trim()}
          className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg font-medium transition-colors min-h-[48px] flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Floating Run Button (for quick access when keyboard is open) */}
      {keyboardOpen && activeTab === 'code' && (
        <button
          type="button"
          onClick={() => {
            setActiveTab('output');
            onRun();
          }}
          className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 z-50"
          aria-label="Run code"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      <style jsx>{`
        .mobile-code-editor {
          min-height: 400px;
        }
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .safe-area-bottom {
            padding-bottom: calc(12px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}
