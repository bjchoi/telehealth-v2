import React from 'react';
import { Heading } from '../../../components/Heading';
import { InfoForm, Layout } from '../../../components/Patient';

enum FormStep {
  INFO,
  HEALTH,
  INSURANCE_UPLOAD,
  INSURANCE_MANUAL,
  PAYMENT,
}

const OnDemandPage = () => {
  return (
    <Layout>
      <Heading>Please Share Your Info</Heading>
      <InfoForm />
    </Layout>
  );
};

export default OnDemandPage;
