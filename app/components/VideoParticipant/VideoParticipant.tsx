import { useEffect, useState } from 'react';
import { joinClasses } from '../../utils';
import { Icon } from '../Icon';

export interface VideoParticipantProps {
  hasAudio?: boolean;
  hasVideo?: boolean;
  isProvider?: boolean;
  isOverlap?: boolean;
  name: string;
}

export const VideoParticipant = ({
  name,
  hasAudio,
  hasVideo,
  isProvider,
  isOverlap,
}: VideoParticipantProps) => {
  const [showMutedBanner, setShowMutedBanner] = useState(null);

  // TODO - move to tailwind config
  const widthClass = isOverlap
    ? 'w-[92px]'
    : isProvider
    ? 'w-[405px]'
    : 'w-[274px]';
  const heightClass = isOverlap
    ? 'h-[122px]'
    : isProvider
    ? 'h-[234px]'
    : 'h-[364px]';

  useEffect(() => {
    if (showMutedBanner !== null) {
      setShowMutedBanner(!hasAudio);
    } else {
      setShowMutedBanner(false);
    }

    const timer = setTimeout(() => {
      setShowMutedBanner(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasAudio]);

  return (
    <div className="mx-auto relative w-max">
      {showMutedBanner && (
        <div className="absolute top-0 bottom-0 left--2 right--2 flex items-center justify-center w-full">
          <div className="bg-[#000000BF] text-white h-min text-center flex-grow py-4">
            You have been muted
          </div>
        </div>
      )}
      <div
        className={`flex items-center justify-center bg-twilio-gray text-white text-2xl ${heightClass} ${widthClass}`}
      >
        {!hasVideo && name}
        {isProvider
          ? hasVideo && <img src="/provider.jpg" alt="Provider" />
          : hasVideo && <img src="/patient.jpg" alt="Patient" />}
      </div>
      <div className="absolute bottom-0 right-0 text-white bg-[#00000082] px-2 py-1 flex items-center">
        <Icon
          className={joinClasses('text-md', !hasAudio && 'text-twilio-red')}
          name="mic"
        />
        {hasVideo ? (
          !isOverlap && name
        ) : (
          <Icon className="text-md text-twilio-red" name="videocam_off" />
        )}
      </div>
    </div>
  );
};
