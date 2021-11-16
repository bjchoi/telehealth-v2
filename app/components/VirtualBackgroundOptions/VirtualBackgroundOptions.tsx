import React, { useRef, useState } from 'react';
import { joinClasses } from '../../utils';
import { Icon } from '../Icon';

export interface VirtualBackgroundOptionsProps {
  isDark?: boolean;
}

export const VirtualBackgroundOptions = ({
  isDark,
}: VirtualBackgroundOptionsProps) => {
  const fileInputRef = useRef(null);
  const [selected, setSelected] = useState('none');
  const Option = ({ className = null, name = null, ...props }) => (
    <div
      className={joinClasses(
        'flex items-center justify-center border rounded h-[70px] cursor-pointer',
        className,
        selected === name
          ? 'border-link'
          : isDark
          ? 'border-light'
          : 'border-black'
      )}
      onClick={() => setSelected(name)}
      {...props}
    ></div>
  );

  return (
    <div className="grid grid-cols-3 gap-1">
      <Option name="none">None</Option>
      <Option name="blur">Blur</Option>
      <Option
        name="desk"
        className="bg-cover bg-center"
        style={{
          backgroundImage: `url(/virtual-backgrounds/desk.jpg)`,
        }}
      />
      <Option
        name="mountains"
        className="bg-cover bg-center"
        style={{
          backgroundImage: `url(/virtual-backgrounds/mountains.jpg)`,
        }}
      />
      <Option
        name="beach"
        className="bg-cover bg-center"
        style={{
          backgroundImage: `url(/virtual-backgrounds/beach.jpg)`,
        }}
      />
      <Option name="upload">
        <a
          className="flex items-center text-link text-xs"
          onClick={() => fileInputRef?.current.click()}
        >
          <Icon name="add" /> <span className="underline">Upload</span>
        </a>
        <input ref={fileInputRef} type="file" className="hidden" />
      </Option>
    </div>
  );
};
