import { useRef, useEffect } from 'react';
import useChatContext from '../Base/ChatProvider/useChatContext/useChatContext';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ChatMessage } from './ChatMessage/ChatMessage';
import ChatInput from './ChatInput/ChatInput';

export interface ChatProps {
  close?: () => void;
  userName: string;
  userRole: string;
  inputPlaceholder?: string;
  showHeader?: boolean;
}

const providerName = 'Dr. Josefina Santos';
const patientName = 'Sarah Cooper';

export const Chat = ({ inputPlaceholder, showHeader, userName, userRole }: ChatProps) => {
  const fileInputRef = useRef(null);
  const messageListRef = useRef(null);
  const { messages, isChatWindowOpen, setIsChatWindowOpen, conversation } = useChatContext();

  // Scrolls to the bottom of the dummy div in chat
  useEffect(() => {
    if (isChatWindowOpen) {
      messageListRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages])

  return (
    <>
      <div className="relative flex flex-col items-center h-full w-full">
        {showHeader && (
          <div className="relative bg-primary text-white rounded-t p-2 text-center w-full">
            Chat with {patientName}
            {isChatWindowOpen && (
              <button
                className="absolute right-3"
                type="button"
                onClick={() => setIsChatWindowOpen(!isChatWindowOpen)}
              >
                <Icon name="close" />
              </button>
            )}
          </div>
        )}
        <div className="bg-white flex-grow w-full p-3 overflow-auto pb-16">
          {messages.map((message, i) => {
            //console.log(message, userRole);
            if (message.body) {
              return <ChatMessage 
                key={i} 
                isSelf={message.author === userRole ? true : false} 
                name={message.author ===  userRole ? userName : message.author} 
                content={message.body}
              />
            }
          })}
          <div className="bottom-scroll" ref={messageListRef} />
        </div>
        <ChatInput conversation={conversation} isChatWindowOpen={isChatWindowOpen} inputPlaceholder={inputPlaceholder}/>
      </div>
    </>
  );
};
