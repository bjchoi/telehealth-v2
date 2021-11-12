import { joinClasses } from '../../utils';

export interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  isDark?: boolean;
  options: { label?: string; value: any }[];
}

export const Select = ({
  className,
  isDark,
  options,
  placeholder,
  ...props
}: SelectProps) => {
  return (
    <select
      className={joinClasses(
        'px-3 py-2 border border-light rounded-md text-dark',
        isDark && 'bg-black border-dark',
        className
      )}
      {...props}
    >
      {placeholder && (
        <option selected value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label ?? option.value}
        </option>
      ))}
    </select>
  );
};
