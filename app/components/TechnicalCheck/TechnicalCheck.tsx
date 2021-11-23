import React, {useState, useEffect} from 'react';
import {LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../Base/ParticipantTracks/Publication/VideoTrack/VideoTrack';
import useVideoContext from '../Base/VideoProvider/useVideoContext/useVideoContext';
import { Button, ButtonVariant } from '../Button';
import AudioTrack from '../Base/ParticipantTracks/Publication/AudioTrack/AudioTrack';

export interface TechnicalCheckProps {
  // Can be removed in actual implementation
  videoImage: string;
}

export const TechnicalCheck = ({ videoImage }: TechnicalCheckProps) => {

  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  let isMobile: boolean = (width <= 768);

  const { localTracks }: { localTracks: (LocalAudioTrack | LocalVideoTrack)[]} = useVideoContext();

  const [isMuted, setMute] = useState(false);
  const [isVideoStopped, setVideoState] = useState(false);
  const [flipCamera, setFlipCamera] = useState(false);

  const audioTrack = localTracks.find(track => track.kind ==='audio' ) as LocalAudioTrack;
  const videoTrack = localTracks.find(track => track.kind === 'video' ) as LocalVideoTrack;

  if (videoTrack) {
    if (isVideoStopped) {
      videoTrack.disable()
    } else {
      videoTrack.enable();
    }
  }

  if (audioTrack) {
    if (isMuted) {
      audioTrack.disable()
    } else {
      audioTrack.enable();
    }
  }

  const muteUnmuteAction = () => {
      setMute(!isMuted);
  };
  const stopShowVideoAction = () => {
      setVideoState(!isVideoStopped);
  }

  const flipCameraAction = () => {
    setFlipCamera(!flipCamera);
  }

  return (
    <div className="flex mt-4 mb-1">

      <div className="flex flex-col justify-center px-1">
        {isMobile && <Button
          className="my-2"
          icon="flip_camera_ios"
          iconType="outline"
          variant={ButtonVariant.tertiary}
          onClick={flipCameraAction}
        />}
        <Button
          className="my-2"
          icon={isVideoStopped ? "videocam_off": "videocam"}
          iconType="outline"
          variant={ButtonVariant.tertiary}
          onClick={stopShowVideoAction}
        />
        <Button
          className="my-2"
          icon={isMuted ? "mic_off" : "mic"}
          iconType="outline"
          variant={ButtonVariant.tertiary}
          onClick={muteUnmuteAction}
        />
      </div>
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
