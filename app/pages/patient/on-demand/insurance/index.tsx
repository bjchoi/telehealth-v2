import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonVariant } from '../../../../components/Button';
import { Heading } from '../../../../components/Heading';
import {
  InsuranceForm,
  Layout,
  UploadInsurance,
} from '../../../../components/Patient';

const InsurancePage = () => {
  const router = useRouter();
  const [enterManually, setEnterManually] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <Heading>Your Insurance</Heading>
        <p className="mt-2 mb-7 text-center text-dark">
          Your insurance may cover part of the cost of this visit. Please upload
          a photo of your insurance card.
        </p>
        {enterManually ? (
          <InsuranceForm
            onSubmit={(formValue) => {
              router.push(`/patient/on-demand/payment`);
            }}
          />
        ) : (
          <>
            <UploadInsurance onSubmit={(formValue) => {}} />{' '}
            <Button
              className="mt-8"
              variant={ButtonVariant.secondary}
              outline
              onClick={() => setEnterManually(true)}
            >
              Enter information manually
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default InsurancePage;
