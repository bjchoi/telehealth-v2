import { joinClasses } from '../../../utils';

export interface ChatMessageProps {
  content: string;
  isProvider?: boolean;
  name: string;
}

export const ChatMessage = ({
  content,
  isProvider,
  name,
}: ChatMessageProps) => {
  return (
    <div className={joinClasses('mb-5', !isProvider && 'text-right')}>
      <div className="text-sm text-twilio-blue mb-3">{name}</div>
      <span
        className={joinClasses(
          'p-2 rounded-md',
          !isProvider ? 'bg-twilio-light-gray' : 'bg-twilio-red text-white'
        )}
      >
        {content}
      </span>
    </div>
  );
};
