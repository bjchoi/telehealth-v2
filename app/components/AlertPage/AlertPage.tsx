import React from 'react';
import { Heading } from '../Heading';
import { PatientLayout } from '../PatientLayout';

export interface AlertPageProps {
  title: string;
  icon?: React.ReactChild;
  content: React.ReactChild;
  footer?: React.ReactChild;
}

export const AlertPage = ({ content, footer, icon, title }: AlertPageProps) => {
  return (
    <PatientLayout>
      <div className="flex flex-col items-center text-center">
        <Heading>{title}</Heading>
        {icon && <div className="mt-10">{icon}</div>}
        <div className="my-10">{content}</div>
        {footer && footer}
      </div>
    </PatientLayout>
  );
};
