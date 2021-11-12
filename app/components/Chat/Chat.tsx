import { useRef, useState } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ChatMessage } from './ChatMessage/ChatMessage';

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
  const [messages, setMessages] = useState([
    { name: providerName, isProvider: true, content: 'Any symptoms?' },
    {
      name: patientName,
      isProvider: false,
      content: 'Just a mild fever of 99.7',
    },
  ]);

  function sendMessage(event) {
    event.preventDefault();
    setMessages([
      ...messages,
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
        <div className="bg-white flex-grow w-full p-3 overflow-auto pb-16">
          {messages.map((message, i) => (
            <ChatMessage key={i} {...message} />
          ))}
        </div>
        <div className="absolute bottom-0 bg-white w-full p-3">
          <form
            className="flex justify-center items-center"
            onSubmit={sendMessage}
          >
            <div className="pr-2">
              <Button
                type="button"
                className="bg-white text-primary border-0"
                icon="file_upload"
                iconType="outline"
                onClick={() => fileInputRef?.current?.click()}
              />
              <input ref={fileInputRef} className="hidden" type="file" />
            </div>
            <div className="flex-grow">
              <input
                className="bg-[#F4F4F4] rounded-[4.5em] p-2 px-4 w-full"
                type="text"
                placeholder={inputPlaceholder}
                value={messageValue}
                onChange={(event) => setMessageValue(event.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
