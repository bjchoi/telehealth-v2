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
import {TelehealthVisit, TwilioPage} from '../../../types';
import ProviderVideoContextLayout from '../../../components/Provider/ProviderLayout';
import clientStorage from '../../../services/clientStorage';
import {STORAGE_USER_KEY, STORAGE_VISIT_KEY} from "../../../constants";
import datastoreService from '../../../services/datastoreService';
import { ProviderUser, EHRContent } from '../../../types';

const DashboardPage: TwilioPage = () => {
  
  const { getAudioAndVideoTracks } = useVideoContext();
  const [ mediaError, setMediaError] = useState<Error>();
  const [ visitNext, setVisitNext ] = useState<TelehealthVisit>();
  const [ visitQueue, setVisitQueue ] = useState<TelehealthVisit[]>([]);
  const [ contentAssigned, setContentAssigned ] = useState<EHRContent>();
  const [ contentAvailable, setContentAvailable ] = useState<EHRContent[]>([]);

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
      const u =  await clientStorage.getFromStorage<ProviderUser>(STORAGE_USER_KEY);

      const tv: TelehealthVisit[] = await datastoreService.fetchAllTelehealthVisits(u);
      setVisitQueue(tv);
      setVisitNext(tv[0]);
      console.log('NEXT VISIT IS', visitNext);

      const cArray: EHRContent[] = await datastoreService.fetchAllContent(u);
      setContentAvailable(cArray);
      setContentAssigned(cArray.find((c) => {
        c.provider_ids.some(e => e === u.id);
      }));
    }
    const tvList = _fetchFromServer();

  }, []);

  return (
    <Layout>
      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1" >
        <div>
          <NextPatientCard className="my-2" visitNext={visitNext} />
          <InviteCard />
        </div>
        <div>
          <PatientQueueCard className="my-2" visitQueue={visitQueue} />
          <ContentManagementCard className="my-2" contentAssigned={contentAssigned} contentAvailable={contentAvailable}/>
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
