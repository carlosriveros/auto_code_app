'use client';

import { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/lib/types';
import { Message } from './Message';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-md">
          <div className="text-5xl sm:text-6xl mb-4">💬</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Start building with AI
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Tell Claude what you want to build and it will generate the code for
            you.
          </p>
          <div className="mt-6 text-left bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Try asking:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• "Build a React counter app"</li>
              <li>• "Create a todo list app"</li>
              <li>• "Make a simple calculator"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 sm:space-y-6 scrollable pb-40 md:pb-24">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-start gap-3 py-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-sm text-gray-500">Claude is thinking...</span>
            </div>
          </div>
        </div>
      )}

      {/* Extra spacing for fixed input (+ bottom nav on mobile) */}
      <div ref={bottomRef} />
    </div>
  );
}
