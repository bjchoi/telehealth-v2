import { useRef, useState } from 'react';
import useChatContext from '../Base/ChatProvider/useChatContext/useChatContext';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ChatMessage } from './ChatMessage/ChatMessage';
import ChatInput from './ChatInput/ChatInput';

export interface ChatProps {
  close?: () => void;
  inputPlaceholder?: string;
  showHeader?: boolean;
}

const providerName = 'Dr. Josefina Santos';
const patientName = 'Sarah Cooper';

export const Chat = ({ close, inputPlaceholder, showHeader }: ChatProps) => {
  const fileInputRef = useRef(null);
  const [messageValue, setMessageValue] = useState('');
  const { messages, isChatWindowOpen, conversation } = useChatContext();
  const [fakeMessages, setFakeMessages] = useState([
    { name: providerName, isProvider: true, content: 'Any symptoms?' },
    {
      name: patientName,
      isProvider: false,
      content: 'Just a mild fever of 99.7',
    },
  ]);

  function sendMessage(event) {
    event.preventDefault();
    setFakeMessages([
      ...fakeMessages,
      {
        name: patientName,
        isProvider: false,
        content: messageValue,
      },
    ]);
    setMessageValue('');
  }

  return (
    <>
      <div className="relative flex flex-col items-center h-full w-full">
        {showHeader && (
          <div className="relative bg-primary text-white rounded-t p-2 text-center w-full">
            Chat with {patientName}
            {close && (
              <button
                className="absolute right-3"
                type="button"
                onClick={close}
              >
                <Icon name="close" />
              </button>
            )}
          </div>
        )}
        {/* Message List */}
        <div className="bg-white flex-grow w-full p-3 overflow-auto pb-16">
          {messages.map((message, i) => {
            if (message.body) {
              return <ChatMessage key={i} isProvider={false} name={providerName} content={message.body}/>
            }
          })}
        </div>
        <ChatInput conversation={conversation} isChatWindowOpen={isChatWindowOpen} inputPlaceholder={inputPlaceholder}/>
      </div>
    </>
  );
};
