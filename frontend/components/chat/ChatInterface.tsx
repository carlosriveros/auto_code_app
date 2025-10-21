'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promptsApi } from '@/lib/api/prompts';
import { deploymentsApi } from '@/lib/api/deployments';
import { Message } from '@/lib/types';
import { MessageList } from './MessageList';
import { PromptInput } from './PromptInput';
import { Loader2, Rocket, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

export function ChatInterface() {
  const params = useParams();
  const projectId = params?.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const queryClient = useQueryClient();

  // Load conversation history
  const { data: conversationData, isLoading } = useQuery({
    queryKey: ['conversation', projectId],
    queryFn: () => promptsApi.getConversation(projectId),
    enabled: !!projectId,
  });

  // Update messages when conversation loads
  useEffect(() => {
    if (conversationData?.conversation?.messages) {
      setMessages(conversationData.conversation.messages);
    }
  }, [conversationData]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (message: string) =>
      promptsApi.sendPrompt(projectId, {
        message,
        conversationHistory: messages,
      }),
    onMutate: async (message) => {
      // Optimistically add user message
      const newMessage: Message = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      return { previousMessages: messages };
    },
    onSuccess: (data) => {
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Invalidate queries to refresh file list if files were modified
      if (data.fileOperations.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['files', projectId] });
      }
    },
    onError: (_error, _variables, context) => {
      // Revert to previous messages on error
      if (context?.previousMessages) {
        setMessages(context.previousMessages);
      }
    },
  });

  // Deploy mutation
  const deployMutation = useMutation({
    mutationFn: () => deploymentsApi.deploy(projectId),
    onSuccess: (data) => {
      // Invalidate deployment queries
      queryClient.invalidateQueries({ queryKey: ['deployment', projectId] });
    },
  });

  // Get latest deployment
  const { data: deploymentData } = useQuery({
    queryKey: ['deployment', projectId],
    queryFn: () => deploymentsApi.getLatestDeployment(projectId),
    enabled: !!projectId,
    refetchInterval: deployMutation.isPending ? 3000 : false, // Poll while deploying
  });

  const handleSendMessage = (message: string) => {
    if (message.trim() && !sendMutation.isPending) {
      sendMutation.mutate(message);
    }
  };

  const handleDeploy = () => {
    if (!deployMutation.isPending) {
      deployMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const latestDeployment = deploymentData?.deployment;

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Compact Status Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 sticky top-0 z-10 safe-top">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {latestDeployment?.deploy_url && (
            <a
              href={latestDeployment.deploy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 truncate touch-target"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">View Live Site</span>
              <span className="sm:hidden">Live</span>
            </a>
          )}
          {latestDeployment?.status === 'success' && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Deployed</span>
            </div>
          )}
          {latestDeployment?.status === 'failed' && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <XCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Failed</span>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {deployMutation.isSuccess && deployMutation.data && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            Successfully deployed!
            <a
              href={deployMutation.data.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-green-900"
            >
              View deployment
            </a>
          </div>
        </div>
      )}

      {/* Error Message */}
      {deployMutation.isError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <XCircle className="h-4 w-4" />
            Deployment failed. Please try again.
          </div>
        </div>
      )}

      <MessageList messages={messages} isLoading={sendMutation.isPending} />
      <PromptInput
        onSend={handleSendMessage}
        disabled={sendMutation.isPending}
      />

      {/* Floating Action Button (FAB) for Deploy */}
      <button
        onClick={handleDeploy}
        disabled={deployMutation.isPending}
        className="fixed bottom-36 md:bottom-24 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center z-[60] touch-target group"
        title={deployMutation.isPending ? "Deploying..." : "Deploy to production"}
      >
        {deployMutation.isPending ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Rocket className="h-6 w-6 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}
