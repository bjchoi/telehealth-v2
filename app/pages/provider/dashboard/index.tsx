import React, { useEffect, useState } from 'react';
import VideoContextLayout from '../../../components/Base/VideoProvider';
import useVideoContext from '../../../components/Base/VideoProvider/useVideoContext/useVideoContext';
import {
  AudioVideoCard,
  ContentManagementCard,
  InviteCard,
  Layout,
  PatientQueueCard,
} from '../../../components/Provider';
import { NextPatientCard } from '../../../components/Provider/NextPatientCard';
import { TwilioPage } from '../../../types';

const DashboardPage: TwilioPage = () => {
  
  const { getAudioAndVideoTracks } = useVideoContext();
  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  return (
    <Layout>
      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1" >
        <div>
          <NextPatientCard className="my-2" />
          <InviteCard />
        </div>
        <div>
          <PatientQueueCard className="my-2" />
          <ContentManagementCard className="my-2" />
        </div>
        <div className="order-first lg:order-last">
          <AudioVideoCard />
        </div>
      </div>
    </Layout>
  );
};
 
DashboardPage.Layout = VideoContextLayout;
export default DashboardPage;
