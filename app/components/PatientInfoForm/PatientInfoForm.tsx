import { Input } from '../Input';

export interface PatientInfoFormProps {
  title?: string;
}

export const PatientInfoForm = ({ title }: PatientInfoFormProps) => {
  return (
    <div className="flex flex-col h-full">
      <p className="text-twilio-gray">This will be shared with your doctor.</p>
      <Input className="my-2" placeholder="First Name" />
      <Input className="my-2" placeholder="Last Name" />
      <Input className="my-2" placeholder="Phone Number" />
      <Input className="my-2" placeholder="Email" />
    </div>
  );
};
