import React from 'react';
import { Heading } from '../Heading';

export interface AlertProps {
  className?: string;
  title: string;
  titleAfterIcon?: boolean;
  icon?: React.ReactChild;
  content: React.ReactChild;
  footer?: React.ReactChild;
}

export const Alert = ({
  content,
  footer,
  icon,
  title,
  titleAfterIcon,
}: AlertProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {!titleAfterIcon && <Heading>{title}</Heading>}
      {icon && (
        <div className={!titleAfterIcon ? 'mt-10' : 'mb-10'}>{icon}</div>
      )}
      {titleAfterIcon && <Heading>{title}</Heading>}
      <div className="my-3">{content}</div>
      {footer && footer}
    </div>
  );
};
