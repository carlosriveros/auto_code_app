import { Message as MessageType } from '@/lib/types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-2 sm:gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
          AI
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';

                  if (!inline && language) {
                    return (
                      <CodeBlock
                        code={String(children).replace(/\n$/, '')}
                        language={language}
                      />
                    );
                  }

                  return (
                    <code
                      className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-xs sm:text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 text-sm sm:text-base">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1 text-sm sm:text-base">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1 text-sm sm:text-base">
                    {children}
                  </ol>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
          U
        </div>
      )}
    </div>
  );
}
