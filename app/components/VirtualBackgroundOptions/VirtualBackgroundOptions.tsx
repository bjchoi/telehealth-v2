import React from 'react';
import { Alert } from '../Alert';
import { Button, ButtonVariant } from '../Button';

export interface VirtualBackgroundOptionsProps {}

export const VirtualBackgroundOptions = ({}: VirtualBackgroundOptionsProps) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      <div className="border rounded h-[54px]"></div>
      <div className="border rounded h-[54px]"></div>
      <div className="border rounded h-[54px]"></div>
      <div className="border rounded h-[54px]"></div>
      <div className="border rounded h-[54px]"></div>
      <div className="border rounded h-[54px]"></div>
    </div>
  );
};
