import React, { useEffect, useState } from 'react';
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
import ProviderVideoContextLayout from '../../../components/Provider/ProviderLayout';
import datastoreService from '../../../services/datastoreService';
import clientStorage from '../../../services/clientStorage';
import {STORAGE_VISIT_KEY} from "../../../constants";

const DashboardPage: TwilioPage = () => {
  
  const { getAudioAndVideoTracks } = useVideoContext();
  const [mediaError, setMediaError] = useState<Error>();
  let patientQueue = null;

  useEffect(() => {
    if (!mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, mediaError]);

  useEffect( () => {
    async function _fetchFromServer() {
      const u = null; // TODO get ProviderUser = null;

      patientQueue = await datastoreService.fetchAllTelehealthVisits(u);

      if (patientQueue.length > 0) {
        clientStorage.saveToStorage(STORAGE_VISIT_KEY, patientQueue[0]);
      }
    }
    const tvList = _fetchFromServer();

  }, []);

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
 
DashboardPage.Layout = ProviderVideoContextLayout;
export default DashboardPage;
