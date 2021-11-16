import React from 'react';
import { useRouter } from 'next/router';
import { Heading } from '../../../components/Heading';
import { InfoForm, Layout } from '../../../components/Patient';

const InfoFormPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Heading>Please Share Your Info</Heading>
      <InfoForm
        onSubmit={(formValue) => {
          router.push(`/patient/on-demand/health`);
        }}
      />
    </Layout>
  );
};

export default InfoFormPage;
