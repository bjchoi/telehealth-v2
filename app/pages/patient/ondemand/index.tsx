import React from 'react';
import { Heading } from '../../../components/Heading';
import { PatientLayout } from '../../../components/PatientLayout';
import { PatientInfoForm } from '../../../components/PatientInfoForm';

enum FormStep {
  INFO,
  HEALTH,
  INSURANCE_UPLOAD,
  INSURANCE_MANUAL,
  PAYMENT,
}

const OnDemandPage = () => {
  return (
    <PatientLayout>
      <Heading>Please Share Your Info</Heading>
      <PatientInfoForm />
    </PatientLayout>
  );
};

export default OnDemandPage;
