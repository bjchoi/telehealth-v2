import React, { useEffect, useState } from 'react';
import { joinClasses } from '../../../utils';
import useParticipants from '../../Base/VideoProvider/useParticipants/useParticipants';
import useVideoContext from '../../Base/VideoProvider/useVideoContext/useVideoContext';
import { Chat } from '../../Chat';
import { ConnectionIssueModal } from '../../ConnectionIssueModal';
import { PoweredByTwilio } from '../../PoweredByTwilio';
import { VideoControls } from '../../VideoControls';
import { InviteParticipantPopover } from './InviteParticipantPopover';
import { SettingsPopover } from './SettingsPopover';
import { VideoParticipant } from './VideoParticipant';
import { ProviderRoomState } from '../../../constants';
import { LocalAudioTrackPublication, LocalVideoTrackPublication } from 'twilio-video';

export interface VideoConsultationProps {}

const providerName = 'Dr. Josefina Santos';

export const VideoConsultation = ({}: VideoConsultationProps) => {
  const [showChat, setShowChat] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [inviteModalRef, setInviteModalRef] = useState(null);
  const [settingsModalRef, setSettingsModalRef] = useState(null);
  const [connectionIssueModalVisible, setConnectionIssueModalVisible] = useState(false);
  const participants = useParticipants();
  const { room } = useVideoContext();
  const [callState, setCallState] = useState<ProviderRoomState>({
    patientName: null,
    providerName: null,
    patientParticipant: null,
    providerParticipant: null
  });

  useEffect(() => {
    if (room) {
      setCallState(prev => {
        return {
          ...prev,
          providerParticipant: room!.localParticipant,
          patientParticipant: participants.find(p => p.identity != room!.localParticipant.identity),
        }
      })
    }
  }, [participants, room])

  useEffect(() => {
    if (callState.providerParticipant) {
      const videoTracks = callState.providerParticipant.videoTracks;
      videoTracks.forEach((item: LocalVideoTrackPublication) => {
        hasVideo ? item.track.enable() : item.track.disable()
      })
    }
  }, [hasVideo]);

  useEffect(() => {
    if (callState.providerParticipant) {
      const audioTracks = callState.providerParticipant.audioTracks;
      audioTracks.forEach((item: LocalAudioTrackPublication) => {
        hasAudio ? item.track.enable() : item.track.disable()
      })
    }
  }, [hasAudio]);

  return (
    <div className="relative h-full">
      <h1 className="absolute text-white text-2xl font-bold top-10 left-32">
        Owl Health
      </h1>
      <div
        className={joinClasses(
          'bg-secondary flex flex-col h-full items-center',
          isRecording ? 'border-[10px] border-primary' : 'p-[10px]'
        )}
      >
        <div className="flex-grow">
          <div className="flex flex-col justify-evenly h-full mt-20">
            {callState.patientParticipant && 
              <VideoParticipant 
                name="Sarah Coopers" 
                hasAudio 
                hasVideo 
                participant={callState.patientParticipant}
              />
            }
            <div className="absolute top-20 right-10">
              {callState.providerParticipant && 
                <VideoParticipant
                  name={providerName}
                  hasAudio={hasAudio}
                  hasVideo={hasVideo}
                  isProvider
                  isSelf
                  participant={callState.providerParticipant}
                />}
            </div>
          </div>
        </div>
        <VideoControls
          containerClass="absolute bottom-16 mb-5 bg-[#FFFFFF4A] rounded-lg"
          addParticipant={(event) =>
            setInviteModalRef(inviteModalRef ? null : event?.target)
          }
          toggleAudio={() => setHasAudio(!hasAudio)}
          toggleChat={() => setShowChat(!showChat)}
          toggleScreenShare={() => {}}
          toggleSettings={(event) =>
            setSettingsModalRef(settingsModalRef ? null : event?.target)
          }
          toggleVideo={() => setHasVideo(!hasVideo)}
        />
        <div className="mt-1 mb-3">
          <PoweredByTwilio inverted />
        </div>
      </div>
      {showChat && (
        <div className="absolute bottom-0 right-10 max-w-[405px] w-full max-h-[400px] h-full">
          <Chat
            close={() => setShowChat(false)}
            showHeader
            inputPlaceholder="Message Sarah Cooper"
          />
        </div>
      )}
      <ConnectionIssueModal
        close={() => setConnectionIssueModalVisible(false)}
        isVisible={connectionIssueModalVisible}
      />
      <InviteParticipantPopover
        referenceElement={inviteModalRef}
        close={() => setInviteModalRef(null)}
        isVisible={!!inviteModalRef}
      />
      <SettingsPopover
        referenceElement={settingsModalRef}
        close={() => setSettingsModalRef(null)}
        isRecording={isRecording}
        isVisible={!!settingsModalRef}
        toggleRecording={() => setIsRecording(!isRecording)}
      />
    </div>
  );
};
