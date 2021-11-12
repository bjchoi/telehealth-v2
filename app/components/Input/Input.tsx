import { joinClasses } from '../../utils';

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  isDark?: boolean;
}

export const Input = ({ className, isDark, ...props }: InputProps) => {
  return (
    <input
      className={joinClasses(
        'px-3 py-2 border border-light rounded-md',
        isDark && 'bg-black border-dark',
        className
      )}
      {...props}
    />
  );
};
