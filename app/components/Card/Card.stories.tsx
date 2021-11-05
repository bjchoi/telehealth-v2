import { Card, CardProps } from './Card';

export default {
  title: 'Card',
  component: Card,
  argTypes: {},
};

const Template = (args: CardProps) => <Card {...args} />;

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  children: 'Card Content',
};
