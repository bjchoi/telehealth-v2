import { joinClasses } from '../../utils';

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={joinClasses(
        'px-3 py-2 border border-twilio-light-gray rounded-md',
        className
      )}
      {...props}
    />
  );
};
