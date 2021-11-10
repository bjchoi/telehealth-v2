import React from 'react';
import { Layout, PatientQueueCard } from '../../../components/Provider';
import { NextPatientCard } from '../../../components/Provider/NextPatientCard';

const DashboardPage = () => {
  return (
    <Layout>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <NextPatientCard />
        </div>
        <div>
          <PatientQueueCard />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
