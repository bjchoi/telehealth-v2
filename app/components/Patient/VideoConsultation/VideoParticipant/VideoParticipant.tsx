import React, { useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { joinClasses } from '../../../../utils';
import ParticipantTracks from '../../../Base/ParticipantTracks/ParticipantTracks';
import useParticipants from '../../../Base/VideoProvider/useParticipants/useParticipants';
import useVideoContext from '../../../Base/VideoProvider/useVideoContext/useVideoContext';
import { Icon } from '../../../Icon';

export interface VideoParticipantProps {
  hasAudio?: boolean;
  hasVideo?: boolean;
  isProvider?: boolean;
  isOverlap?: boolean;
  isSelf?: boolean;
  name: string;
  participant: LocalParticipant | RemoteParticipant
}

export const VideoParticipant = ({
  name,
  hasAudio,
  hasVideo,
  isProvider,
  isOverlap,
  isSelf,
  participant,
}: VideoParticipantProps) => {
  const [showMutedBanner, setShowMutedBanner] = useState(null);
  const [isPinned, setIsPinned] = useState(false);

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
  }, [hasAudio, showMutedBanner]);

  return (
    <div className="mx-auto relative w-max group">
      {!isSelf && (
        <div className="absolute inset-0 text-right w-full flex justify-end group-hover:bg-gradient-to-b from-gray-700 via-transparent to-transparent">
          <div
            className={joinClasses(
              'p-1',
              !isPinned && 'hidden group-hover:block'
            )}
          >
            <button
              className={joinClasses(
                'border-0 bg-transparent rotate-45 p-2',
                isPinned ? 'text-primary' : 'text-white'
              )}
              onClick={() => setIsPinned(!isPinned)}
            >
              <Icon name="push_pin" outline={!isPinned} />
            </button>
          </div>
        </div>
      )}
      {showMutedBanner && (
        <div className="absolute top-0 bottom-0 left--2 right--2 flex items-center justify-center w-full">
          <div className="bg-[#000000BF] text-white h-min text-center flex-grow py-4">
            You have been muted
          </div>
        </div>
      )}
      <div
        className={`flex items-center justify-center bg-dark text-white text-2xl overflow-hidden ${heightClass} ${widthClass}`}
      >
        {!hasVideo && name}
        {hasVideo && <ParticipantTracks
          participant={participant}
          videoOnly
          enableScreenShare={false}
          videoPriority={'high'}
          isLocalParticipant={isSelf}
        />}
      </div>
      <div className="absolute bottom-0 right-0 text-white bg-[#00000082] px-2 py-1 flex items-center">
        <Icon
          className={joinClasses('text-md', !hasAudio && 'text-primary')}
          name="mic"
        />
        {hasVideo ? (
          !isOverlap && name
        ) : (
          <Icon className="text-md text-primary" name="videocam_off" />
        )}
      </div>
    </div>
  );
};
