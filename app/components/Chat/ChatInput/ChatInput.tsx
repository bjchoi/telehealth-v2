import { Button } from '../../Button';
import React, { useRef, useState, useEffect } from 'react';
import { Conversation } from '@twilio/conversations';
import { isMobile } from '../../../utils';

interface ChatInputProps {
  conversation: Conversation;
  inputPlaceholder: string;
  isChatWindowOpen: boolean;
}

export default function ChatInput({ conversation, inputPlaceholder, isChatWindowOpen }: ChatInputProps) {

  const [messageBody, setMessageBody] = useState<string>('');
  const isValidMessage = /\S/.test(messageBody);
  const fileInputRef = useRef(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChatWindowOpen) {
      chatInputRef.current?.focus();
    }
  }, [chatInputRef])

  function handleSendMessage(message: string) {
    if (isValidMessage) {
      conversation.sendMessage(message.trim());
      setMessageBody('');
    }
  }

  function handleSubmit(event: React.KeyboardEvent) {
    if (!isMobile && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(messageBody);
    }
  }

  return (
    <div className="absolute bottom-0 bg-white w-full p-3 flex">
      <form
        className="flex justify-center items-center"
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
        <div className="flex">
          <input
            className="bg-[#F4F4F4] rounded-[4.5em] p-2 px-4 w-full flex-auto"
            type="text"
            ref={chatInputRef}
            onKeyPress={handleSubmit}
            placeholder={inputPlaceholder}
            value={messageBody}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMessageBody(event.target.value)}
          />
          <Button
            type="button"
            className="bg-white text-primary border-0 ml-2 flex-1"
            icon="send"
            iconType="outline"
            onClick={() => handleSendMessage(messageBody)}
          />
        </div>
      </form>
    </div>
  );
}