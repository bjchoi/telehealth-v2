import { useContext } from 'react';
import { ChatContext } from '..';



export default function useConversations() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}