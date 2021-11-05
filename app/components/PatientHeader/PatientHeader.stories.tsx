import { PatientHeader, PatientHeaderProps } from './PatientHeader';

export default {
  title: 'PatientHeader',
  component: PatientHeader,
  argTypes: {},
};

const Template = (args: PatientHeaderProps) => <PatientHeader {...args} />;

export const DefaultPatientHeader = Template.bind({});
DefaultPatientHeader.args = {
  name: 'Owl Health',
};
