import { Heading } from '../Heading';
import { PatientHeader } from '../PatientHeader';
import { PoweredByTwilio } from '../PoweredByTwilio';

export interface PatientLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const PatientLayout = ({ children, title }: PatientLayoutProps) => {
  return (
    <div className="flex flex-col h-full">
      <div>
        <PatientHeader />
      </div>
      <div className="w-full max-w-[320px] mx-auto flex flex-grow justify-center items-center">
        {title && <Heading>{title}</Heading>}
        <div>{children}</div>
      </div>
      <footer className="pt-2 pb-5">
        <PoweredByTwilio className="mx-auto" />
      </footer>
    </div>
  );
};
