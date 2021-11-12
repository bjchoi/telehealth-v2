import { AudioVideoSettings } from '../../AudioVideoSettings';
import { Card } from '../../Card';

export interface AudioVideoCardProps {}

export const AudioVideoCard = ({}: AudioVideoCardProps) => {
  return (
    <>
      <img src="/provider.jpg" alt="Provider" className="border border-light" />
      <Card>
        <AudioVideoSettings />
      </Card>
    </>
  );
};
