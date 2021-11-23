import { Button, ButtonVariant } from '../Button';
import { VideoControlsProps } from '../VideoControls';
import React, { useEffect, useState } from 'react';


export interface SimpleVideoControls extends VideoControlsProps {
  isVideoStopped: boolean;
  isMuted: boolean;
}

export const SimpleVideoControls = ({ containerClass, flipCamera, toggleAudio, toggleVideo, isVideoStopped, isMuted }: SimpleVideoControls) => {

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

  return (
    <div className={containerClass}>
      {isMobile && <Button
        className="my-2"
        icon="flip_camera_ios"
        iconType="outline"
        variant={ButtonVariant.tertiary}
        onClick={flipCamera}
      />}
      <Button
        className="my-2"
        icon={isVideoStopped ? "videocam_off": "videocam"}
        iconType="outline"
        variant={ButtonVariant.tertiary}
        onClick={toggleVideo}
      />
      <Button
        className="my-2"
        icon={isMuted ? "mic_off" : "mic"}
        iconType="outline"
        variant={ButtonVariant.tertiary}
        onClick={toggleAudio}
      />
    </div>
  )
}
