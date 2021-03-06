import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { joinClasses } from '../../utils';

export interface TextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  register?: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
}

export const Textarea = ({
  className,
  name,
  register,
  registerOptions,
  ...props
}: TextareaProps) => {
  return (
    <textarea
      className={joinClasses(
        'px-3 py-2 border border-light rounded-md',
        className
      )}
      {...(register ? register(name, registerOptions) : {})}
      {...props}
    ></textarea>
  );
};
