import React, { useState } from 'react';
import { Button, ButtonVariant } from '../../Button';
import { Chat } from '../../Chat';
import { ConnectionIssueModal } from '../../ConnectionIssueModal';
import { InviteParticipantModal } from '../../InviteParticipantModal';
import { PoweredByTwilio } from '../../PoweredByTwilio';
import { VideoControls } from '../../VideoControls';
import { VideoParticipant } from '../../VideoParticipant';

export interface VideoConsultationProps {}

const providerName = 'Dr. Josefina Santos';

export const VideoConsultation = ({}: VideoConsultationProps) => {
  const [showChat, setShowChat] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [connectionIssueModalVisible, setConnectionIssueModalVisible] =
    useState(false);

  function toggleInviteModal() {
    setInviteModalVisible(!inviteModalVisible);
  }

  return (
    <>
      <div className="bg-secondary flex flex-col h-full items-center">
        <div className="py-5">
          <PoweredByTwilio inverted />
        </div>
        {showChat ? (
          <>
            <div className="flex">
              <div className="relative">
                <VideoParticipant
                  name={providerName}
                  hasAudio
                  hasVideo
                  isProvider
                />
                <div className="absolute top-1 right-1">
                  <VideoParticipant
                    name="Sarah Cooper"
                    hasAudio={hasAudio}
                    hasVideo={hasVideo}
                    isOverlap
                    isSelf
                  />
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
              <Chat inputPlaceholder={`Message to ${providerName}`} />
            </div>
          </>
        ) : (
          <>
            <div className="flex-grow">
              <div className="flex flex-col justify-evenly h-full">
                <VideoParticipant
                  name="Sarah Cooper"
                  hasAudio={hasAudio}
                  hasVideo={hasVideo}
                  isSelf
                />
                <VideoParticipant
                  name={providerName}
                  hasAudio
                  hasVideo
                  isProvider
                />
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
        )}
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
