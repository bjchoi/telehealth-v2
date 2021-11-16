import React, { useEffect, useState } from 'react';
import { Button, ButtonVariant } from '../../../components/Button';
import { DateTime } from '../../../components/DateTime';
import { Heading } from '../../../components/Heading';
import { Layout } from '../../../components/Patient';
import { Modal } from '../../../components/Modal';
import { TechnicalCheck } from '../../../components/TechnicalCheck';
import { PatientUser, TwilioPage } from '../../../types';
import { useVisitContext } from '../../../state/VisitContext';
import useVideoContext from '../../../components/Base/VideoProvider/useVideoContext/useVideoContext';
import VideoContextLayout from '../../../components/Base/VideoProvider';
import { roomService } from '../../../services/roomService';
import { useRouter } from 'next/router';

const WaitingRoomPage: TwilioPage = () => {
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const { visit, user } = useVisitContext();
  const { getAudioAndVideoTracks } = useVideoContext();
  const [mediaError, setMediaError] = useState<Error>();
  const router = useRouter();

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  useEffect(() => {
    if(user && visit) {
      const interval = setInterval(() => roomService.checkRoom(user as PatientUser, visit.roomName)
      .then(room => {
        if(room.roomAvailable) {
          router.push("/patient/video/")
        }
      }), 5000);
      return () => clearInterval(interval);
    }
  }, [router, visit, user]);
  return (
    <Layout>
      { visit ? (
      <div className="my-4 flex flex-col items-center justify-center">
        <Heading>Your Appointment</Heading>
        <div className="mb-2 text-secondary">{visit.providerName}</div>
        <DateTime date={visit.visitDateTime} />

        <TechnicalCheck videoImage="/patient.jpg" />
        <div className="text-tertiary">
          Your visit will start when the provider joins
        </div>
        <div className="flex items-center justify-center bg-secondary text-white text-2xl h-[200px] w-full m-2">
          Content Area
        </div>
        <Button
          className="mt-2 px-8"
          variant={ButtonVariant.secondary}
          outline
          onClick={() => setShowLeaveConfirmation(true)}
        >
          Leave Waiting Room
        </Button>
      </div>) : (<></>)
      }
      <Modal isVisible={showLeaveConfirmation}>
        <div className="flex flex-col text-center p-4">
          <p className="mb-4 text-primary">
            Are you sure you want to leave the waiting room? Your visit will
            start shortly.
          </p>

          <Button
            className="mt-2 px-8"
            onClick={() => setShowLeaveConfirmation(false)}
          >
            Stay in Waiting Room
          </Button>
          <Button
            as="a"
            href="/patient/video"
            className="mt-2 px-8"
            variant={ButtonVariant.secondary}
            outline
          >
            Leave Waiting Room
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

WaitingRoomPage.Layout = VideoContextLayout;
export default WaitingRoomPage;
