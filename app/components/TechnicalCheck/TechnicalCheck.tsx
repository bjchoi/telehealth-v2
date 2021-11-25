import React from 'react';
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
  const audioTrack = localTracks.find(track => track.kind ==='audio' ) as LocalAudioTrack;
  const videoTrack = localTracks.find(track => track.kind === 'video' ) as LocalVideoTrack;

  return (
    <div className="flex mt-4 mb-1">
      <SimpleVideoControls containerClass='flex flex-col justify-center px-1'/>
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
