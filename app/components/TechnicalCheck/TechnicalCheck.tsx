import React, {useState, useEffect} from 'react';
import {LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../Base/ParticipantTracks/Publication/VideoTrack/VideoTrack';
import useVideoContext from '../Base/VideoProvider/useVideoContext/useVideoContext';
import AudioTrack from '../Base/ParticipantTracks/Publication/AudioTrack/AudioTrack';
import { SimpleVideoControls } from '../SimpleVideoControls';

export interface TechnicalCheckProps {
  // Can be removed in actual implementation
  videoImage: string;
}

export const TechnicalCheck = ({ videoImage }: TechnicalCheckProps) => {

  const { localTracks }: { localTracks: (LocalAudioTrack | LocalVideoTrack)[]} = useVideoContext();

  const [isMuted, setMute] = useState(false);
  const [isVideoStopped, setVideoState] = useState(false);
  const [flipCamera, setFlipCamera] = useState(false);

  const audioTrack = localTracks.find(track => track.kind ==='audio' ) as LocalAudioTrack;
  const videoTrack = localTracks.find(track => track.kind === 'video' ) as LocalVideoTrack;

  useEffect(() => {
    if (videoTrack) {
      console.log('video track: ', videoTrack);
      if (isVideoStopped) {
        videoTrack.disable()
      } else {
        videoTrack.enable();
      }
    }

    if (audioTrack) {
      console.log('audio track: ', audioTrack);
      if (isMuted) {
        audioTrack.disable()
      } else {
        audioTrack.enable();
      }
    }
  });

  return (
    <div className="flex mt-4 mb-1">
      <SimpleVideoControls
        containerClass='flex flex-col justify-center px-1'
        flipCamera={() => setFlipCamera(!flipCamera)}
        toggleVideo={() => setVideoState(!isVideoStopped)}
        toggleAudio={() => setMute(!isMuted)}
        isMuted={isMuted}
        isVideoStopped={isVideoStopped}
      />
      <div className="flex-grow px-1">
      {videoTrack ? (
          <VideoTrack track={videoTrack} isLocal />
        ) : (
            <img src={videoImage} alt="Video" width={187} height={250} />
        )}
      </div>
      {audioTrack && <AudioTrack track={audioTrack} />}
    </div>
  );
};
