import React, { useEffect, useState } from 'react';
import { PatientRoomState } from '../../../constants';
import { useVisitContext } from '../../../state/VisitContext';
import useParticipants from '../../Base/VideoProvider/useParticipants/useParticipants';
import useRoomState from '../../Base/VideoProvider/useRoomState/useRoomState';
import useVideoContext from '../../Base/VideoProvider/useVideoContext/useVideoContext';
import { Button, ButtonVariant } from '../../Button';
import { Chat } from '../../Chat';
import { ConnectionIssueModal } from '../../ConnectionIssueModal';
import { InviteParticipantModal } from '../../InviteParticipantModal';
import { PoweredByTwilio } from '../../PoweredByTwilio';
import { VideoControls } from '../../VideoControls';
import { VideoParticipant } from './VideoParticipant';

export interface VideoConsultationProps {}

export const VideoConsultation = ({}: VideoConsultationProps) => {
  const [showChat, setShowChat] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [connectionIssueModalVisible, setConnectionIssueModalVisible] = useState(false);
  const roomState = useRoomState();
  const { user, visit } = useVisitContext();
  const participants = useParticipants();
  const { room } = useVideoContext();
  const [callState, setCallState] = useState<PatientRoomState>({
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
          patientParticipant: room!.localParticipant,
          providerParticipant: participants.find(p => p.identity != room!.localParticipant.identity)
        }
      })
    }
  }, [participants, room])

  function toggleInviteModal() {
    setInviteModalVisible(!inviteModalVisible);
  }

  return (
    <>
      <div className="bg-secondary flex flex-col h-full items-center">
        <div className="py-5">
          <PoweredByTwilio inverted />
        </div>        
        { 
          roomState == 'connected' ? (
          showChat ? (
          <>
            <div className="flex">
              <div className="relative">
              {callState.patientParticipant && <VideoParticipant
                  name={visit.patientName}
                  hasAudio
                  hasVideo
                  isSelf
                  participant={callState.patientParticipant}
                />}
                <div className="absolute top-1 right-1">
                {callState.providerParticipant && <VideoParticipant
                    name={visit.providerName}
                    hasAudio={hasAudio}
                    hasVideo={hasVideo}
                    isOverlap
                    isProvider
                    participant={callState.providerParticipant}
                  /> }
                </div>
                <Button
                  className="absolute left-4 bottom-3"
                  icon="chat_bubble"
                  variant={ButtonVariant.tertiary}
                  onClick={() => setShowChat(!showChat)}
                />
              </div>
            </div>
            <div className="flex-grow w-full">
              <Chat inputPlaceholder={`Message to ${visit.providerName}`} />
            </div>
          </>
        ) : (
          <>
            <div className="flex-grow">
              <div className="flex flex-col justify-evenly h-full">
              {callState.providerParticipant && <VideoParticipant
                  name={visit.providerName}
                  hasAudio={hasAudio}
                  hasVideo={hasVideo}
                  isSelf={false}
                  isProvider={true}
                  participant={callState.providerParticipant}
                />}
                {callState.patientParticipant && <VideoParticipant
                  name={visit.patientName}
                  hasAudio
                  hasVideo
                  isProvider={false}
                  isSelf={true}
                  participant={callState.patientParticipant}
                />}
              </div>
              {showChat && (
                <Button
                  icon="chat_bubble_outline"
                  onClick={() => setShowChat(!showChat)}
                />
              )}
            </div>
            <VideoControls
              containerClass="mb-5 bg-[#FFFFFF4A] rounded-lg"
              addParticipant={toggleInviteModal}
              flipCamera={() => setConnectionIssueModalVisible(true)}
              toggleAudio={() => setHasAudio(!hasAudio)}
              toggleChat={() => setShowChat(!showChat)}
              toggleVideo={() => setHasVideo(!hasVideo)}
            />
          </>
        )):(<></>)}
      </div>
      <ConnectionIssueModal
        close={() => setConnectionIssueModalVisible(false)}
        isVisible={connectionIssueModalVisible}
      />
      <InviteParticipantModal
        close={toggleInviteModal}
        isVisible={inviteModalVisible}
      />
    </>
  );
};
