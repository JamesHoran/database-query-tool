// use-mobile-keyboard.ts - Mobile Keyboard Handling

import { useState, useEffect, useCallback } from 'react';

interface MobileKeyboardState {
  isOpen: boolean;
  viewportHeight: number;
  originalHeight: number;
}

export function useMobileKeyboard() {
  const [state, setState] = useState<MobileKeyboardState>({
    isOpen: false,
    viewportHeight: 0,
    originalHeight: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const originalHeight = window.innerHeight;

    // Fallback: use window resize event
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const isOpen = currentHeight < originalHeight * 0.85;

      setState({
        isOpen,
        viewportHeight: currentHeight,
        originalHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Insert special characters at cursor position (useful for mobile)
  const insertChar = useCallback((char: string) => {
    const textarea = document.querySelector('textarea, [contenteditable="true"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const newValue = value.substring(0, start) + char + value.substring(end);
    textarea.value = newValue;

    // Move cursor after inserted character
    textarea.selectionStart = textarea.selectionEnd = start + char.length;

    // Trigger input event
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
  }, []);

  // Common Python symbols for mobile quick access
  const pythonSymbols = [
    { label: '#', char: '#', name: 'Hash' },
    { label: ':', char: ':', name: 'Colon' },
    { label: '(', char: '(', name: 'Open Paren' },
    { label: ')', char: ')', name: 'Close Paren' },
    { label: '[', char: '[', name: 'Open Bracket' },
    { label: ']', char: ']', name: 'Close Bracket' },
    { label: '{', char: '{', name: 'Open Brace' },
    { label: '}', char: '}', name: 'Close Brace' },
    { label: '_', char: '_', name: 'Underscore' },
    { label: '@', char: '@', name: 'At' },
    { label: '.', char: '.', name: 'Dot' },
    { label: ',', char: ',', name: 'Comma' },
  ];

  return {
    ...state,
    insertChar,
    pythonSymbols,
  };
}
