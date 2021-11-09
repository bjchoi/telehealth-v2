import { Input } from '../../Input';

export interface InfoFormProps {
  title?: string;
}

export const InfoForm = ({ title }: InfoFormProps) => {
  return (
    <div className="flex flex-col h-full">
      <p className="text-dark">This will be shared with your doctor.</p>
      <Input className="my-2" placeholder="First Name" />
      <Input className="my-2" placeholder="Last Name" />
      <Input className="my-2" placeholder="Phone Number" />
      <Input className="my-2" placeholder="Email" />
    </div>
  );
};
