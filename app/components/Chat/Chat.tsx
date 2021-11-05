import { useRef, useState } from 'react';
import { Button } from '../Button';
import { ChatMessage, ChatMessageProps } from './ChatMessage/ChatMessage';

export interface ChatProps {
  inputPlaceholder?: string;
}

const providerName = 'Dr. Josefina Santos';
const patientName = 'Sarah Cooper';

export const Chat = ({ inputPlaceholder }: ChatProps) => {
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
    <div className="bg-white flex flex-col items-center pt-3 px-4 pb-5 h-full w-full">
      <div className="flex-grow w-full">
        {messages.map((message, i) => (
          <ChatMessage key={i} {...message} />
        ))}
      </div>
      <div className="w-full">
        <form
          className="flex justify-center items-center"
          onSubmit={sendMessage}
        >
          <div className="pr-5">
            <Button
              type="button"
              className="bg-white text-twilio-red border-0"
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
  );
};
