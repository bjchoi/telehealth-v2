import { Message } from '@twilio/conversations';
import { joinClasses } from '../../../utils';

export interface ChatMessageProps {
  content?: string;
  isSelf?: boolean;
  name?: string;
  mess?: Message;
}

export const ChatMessage = ({
  content,
  isSelf,
  name,
}: ChatMessageProps) => {
  return (
    <div className={joinClasses('mb-5', !isSelf && 'text-right')}>
      <div className="text-sm text-secondary mb-3">{name}</div>
      
      <span
        className={joinClasses(
          'p-2 rounded-md',
          !isSelf ? 'bg-light' : 'bg-primary text-white'
        )}
      >
        {content}
      </span>
    </div>
  );
};
