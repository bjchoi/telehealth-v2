import { Header, HeaderProps } from './Header';

export default {
  title: 'Header',
  component: Header,
  argTypes: {},
};

const Template = (args: HeaderProps) => <Header {...args} />;

export const DefaultPatientHeader = Template.bind({});
DefaultPatientHeader.args = {
  name: 'Owl Health',
};
