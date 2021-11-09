import { joinClasses } from '../../utils';

export interface TextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={joinClasses(
        'px-3 py-2 border border-light rounded-md',
        className
      )}
      {...props}
    ></textarea>
  );
};
