import { Button } from '../../Button';
import { Input } from '../../Input';
import { Select } from '../../Select';

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
      <div className="flex flex-col">
        <div>Will you need a translator?</div>
        <label>
          <input type="radio" name="translator" /> No
        </label>
        <label>
          <input type="radio" name="translator" /> Yes
        </label>
      </div>
      <Select placeholder="Language" options={[{ value: 'Spanish ' }]} />
      <div className="mt-5 flex flex-col">
        <div>I am</div>
        <label>
          <input type="radio" name="gender" /> Male
        </label>
        <label>
          <input type="radio" name="gender" /> Female
        </label>
        <label>
          <input type="radio" name="gender" /> Other
        </label>
      </div>
      <Button>Continue</Button>
    </div>
  );
};
