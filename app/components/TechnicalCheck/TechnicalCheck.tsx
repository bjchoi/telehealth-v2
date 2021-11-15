// import { useEffect } from 'react';
import React from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../Base/ParticipantTracks/Publication/VideoTrack/VideoTrack';
import useVideoContext from '../Base/VideoProvider/useVideoContext/useVideoContext';
import { Button, ButtonVariant } from '../Button';

export interface TechnicalCheckProps {
  // Can be removed in actual implementation
  videoImage: string;
}

export const TechnicalCheck = ({ videoImage }: TechnicalCheckProps) => {
  /*useEffect(() => {
    // Temporary implementation to ask for user audio and video permission
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {})
      .catch((error) => {
        console.log(error);
      });
  });*/

  const { localTracks } = useVideoContext();
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  return (
    <div className="flex mt-4 mb-1">
      <div className="flex flex-col justify-center px-1">
        <Button
          className="my-2"
          icon="flip_camera_ios"
          iconType="outline"
          variant={ButtonVariant.tertiary}
        />
        <Button
          className="my-2"
          icon="videocam"
          iconType="outline"
          variant={ButtonVariant.tertiary}
        />
        <Button
          className="my-2"
          icon="mic"
          iconType="outline"
          variant={ButtonVariant.tertiary}
        />
      </div>
      <div className="flex-grow px-1">
      {videoTrack ? (
          <VideoTrack track={videoTrack} isLocal />
        ) : (
            <img src={videoImage} alt="Video" width={187} height={250} />
        )}
      </div>
    </div>
  );
};
