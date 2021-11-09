import { Icon } from '../Icon';

export interface DateTimeProps {
  date: Date;
}

const DateTimeIcon = ({ name }) => {
  return <Icon className="mr-2 text-tertiary" name={name} />;
};

export const DateTime = ({ date }: DateTimeProps) => {
  return (
    <div className="flex border border-light rounded-lg text-secondary">
      <div className="flex flex-grow p-2 border-r border-light">
        <DateTimeIcon name="calendar_today" />{' '}
        {date.toLocaleString('default', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
      <div className="flex flex-grow p-2">
        <DateTimeIcon name="schedule" />{' '}
        {date.toLocaleString('default', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </div>
    </div>
  );
};
