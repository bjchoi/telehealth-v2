import { useEffect, useState } from 'react';
import { joinClasses } from '../../utils';

export interface ChipsProps {
  onChange: (value: string[]) => void;
  options?: Chip[];
}

interface Chip {
  label?: string;
  value: string;
}

export const Chips = ({ onChange, options }: ChipsProps) => {
  const [selected, setSelected] = useState([]);

  function toggleChipSelection(value) {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  }

  useEffect(() => {
    onChange(selected);
  }, [onChange, selected]);

  return (
    <div className="flex flex-wrap justify-center">
      {options.map((option) => (
        <div
          className={joinClasses(
            'border p-2 m-1 rounded-full text-sm cursor-pointer',
            selected.includes(option.value)
              ? 'border-primary text-primary'
              : 'border-dark text-dark'
          )}
          key={option.value}
          onClick={() => toggleChipSelection(option.value)}
        >
          {option.label ?? option.value}
        </div>
      ))}
    </div>
  );
};
