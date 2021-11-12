import React from 'react';
import {
  AudioVideoCard,
  ContentManagementCard,
  Layout,
  PatientQueueCard,
} from '../../../components/Provider';
import { NextPatientCard } from '../../../components/Provider/NextPatientCard';

const DashboardPage = () => {
  return (
    <Layout>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <NextPatientCard className="my-2" />
        </div>
        <div>
          <PatientQueueCard className="my-2" />
          <ContentManagementCard className="my-2" />
        </div>
        <div>
          <AudioVideoCard />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
