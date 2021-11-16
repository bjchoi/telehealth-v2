import React from 'react';
import { Heading } from '../Heading';

export interface AlertProps {
  className?: string;
  title: string;
  titleAfterIcon?: boolean;
  icon?: React.ReactChild;
  content: React.ReactChild;
  contentBeforeIcon?: boolean;
  footer?: React.ReactChild;
}

export const Alert = ({
  content,
  contentBeforeIcon,
  footer,
  icon,
  title,
  titleAfterIcon,
}: AlertProps) => {
  const Content = () => <div className="my-3">{content}</div>;
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {!titleAfterIcon && <Heading>{title}</Heading>}
      {contentBeforeIcon && <Content />}
      {icon && (
        <div
          className={!titleAfterIcon && !contentBeforeIcon ? 'mt-10' : 'mb-10'}
        >
          {icon}
        </div>
      )}
      {titleAfterIcon && <Heading>{title}</Heading>}
      {!contentBeforeIcon && <Content />}
      {footer && footer}
    </div>
  );
};
