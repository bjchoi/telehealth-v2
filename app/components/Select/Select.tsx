import { joinClasses } from '../../utils';

export interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: { label?: string; value: any }[];
}

export const Select = ({ className, options, ...props }: SelectProps) => {
  return (
    <select
      className={joinClasses(
        'px-3 py-2 border border-light rounded-md',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label ?? option.value}
        </option>
      ))}
    </select>
  );
};
