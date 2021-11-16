import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Heading } from '../../../components/Heading';
import { HealthForm, Layout } from '../../../components/Patient';

const HealthFormPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Heading>About your health</Heading>
      <HealthForm
        onSubmit={(formValue) => {
          router.push(`/patient/on-demand/insurance`);
        }}
      />
    </Layout>
  );
};

export default HealthFormPage;
