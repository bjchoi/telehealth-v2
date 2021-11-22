import { useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';
import { joinClasses } from '../../../../utils';
import ParticipantTracks from '../../../Base/ParticipantTracks/ParticipantTracks';
import { Icon } from '../../../Icon';
import { Popover } from '../Popover';

export interface VideoParticipantProps {
  hasAudio?: boolean;
  hasVideo?: boolean;
  isProvider?: boolean;
  isSelf?: boolean;
  name: string;
  participant: LocalParticipant | RemoteParticipant;
}

export const VideoParticipant = ({
  name,
  hasAudio,
  hasVideo,
  isProvider,
  isSelf,
  participant
}: VideoParticipantProps) => {
  const [showMutedBanner, setShowMutedBanner] = useState(null);
  const [showMenuRef, setShowMenuRef] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [muted, setMuted] = useState(!hasAudio);
  const [showVideo, setShowVideo] = useState(hasVideo);
  // TODO - move to tailwind config
  const widthClass = isProvider ? 'w-[405px]' : 'w-[685px]';
  const heightClass = isProvider ? 'h-[234px]' : 'max-h-100%';

  useEffect(() => {
    if (showMutedBanner !== null) {
      setShowMutedBanner(!muted);
    } else {
      setShowMutedBanner(false);
    }

    const timer = setTimeout(() => {
      setShowMutedBanner(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [muted, showMutedBanner]);

  useEffect(() => {
    setMuted(hasAudio);
  }, [hasAudio]);

  useEffect(() => {
    setShowVideo(hasVideo);
  }, [hasVideo]);

  return (
    <div className="mx-auto relative w-max group">
      {!isSelf && (
        <div className="absolute top-0 h-[100px] text-right w-full flex justify-end group-hover:bg-gradient-to-b from-[#000000B0] via-[#00000000] to-[#00000000] z-10">
          <div>
            <button
              className={joinClasses(
                '-mt-1 rotate-45 p-2',
                isPinned ? 'text-primary' : 'hidden'
              )}
              onClick={() => setIsPinned(!isPinned)}
            >
              <Icon name="push_pin" outline={!isPinned} />
            </button>
          </div>
          <div className={joinClasses('hidden group-hover:block')}>
            <button
              className={joinClasses('-mt-1 border-0 bg-transparent px-1')}
              onClick={(event) => setShowMenuRef(event.target)}
            >
              <Icon className="text-white text-4xl" name="more_horiz" />
            </button>
            <Popover
              referenceElement={showMenuRef}
              isVisible={!!showMenuRef}
              close={() => setShowMenuRef(null)}
            >
              <ul>
                <li className="m-2">
                  <button
                    className="w-full text-left"
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                  >
                    {isPinned ? 'Unpin' : 'Pin'} Participant
                  </button>
                </li>
                <li className="border-t border-dark"></li>
                <li className="m-2">
                  <button
                    className="w-full text-left"
                    type="button"
                    onClick={() => setMuted(!muted)}
                  >
                    {muted ? 'Unmute' : 'Mute'} participant
                  </button>
                </li>
                <li className="m-2">
                  <button
                    className="w-full text-left"
                    type="button"
                    onClick={() => setShowVideo(!showVideo)}
                  >
                    Turn {showVideo ? 'off' : 'on'} participant video
                  </button>
                </li>
              </ul>
            </Popover>
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
        className={`relative flex items-center justify-center bg-dark text-white text-2xl overflow-hidden ${heightClass} ${widthClass}`}
      >
        {!showVideo && (
          <div className="absolute inset-0 bg-dark text-white flex items-center justify-center">
            {name}
          </div>
        )}
        <ParticipantTracks
          participant={participant}
          videoOnly
          enableScreenShare={false}
          videoPriority={'high'}
          isLocalParticipant={isSelf}
        />
      </div>
      <div className="absolute top-0 left-0 w-max z-50 text-white bg-[#00000082] px-2 py-1 flex items-center">
        <Icon
          className={joinClasses('text-md', muted && 'text-primary')}
          name="mic"
        />
        {showVideo ? (
          !isSelf && name
        ) : (
          <Icon className="text-md text-primary" name="videocam_off" />
        )}
      </div>
    </div>
  );
};
