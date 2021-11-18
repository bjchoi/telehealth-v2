import { AudioVideoSettings } from '../../AudioVideoSettings';
import { LocalVideoTrack } from 'twilio-video';
import useVideoContext from '../../Base/VideoProvider/useVideoContext/useVideoContext';
import { Card } from '../../Card';
import VideoTrack from '../../Base/ParticipantTracks/Publication/VideoTrack/VideoTrack';

export interface AudioVideoCardProps {}

export const AudioVideoCard = ({}: AudioVideoCardProps) => {
  const { localTracks } = useVideoContext();

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack; 

  return (
    <>
      {videoTrack ? 
          <VideoTrack track={videoTrack} isLocal /> : 
          <img src="/provider.jpg" alt="Provider" className="border border-light" /> 
      }
      <Card>
        <AudioVideoSettings />
      </Card>
    </>
  );
};
