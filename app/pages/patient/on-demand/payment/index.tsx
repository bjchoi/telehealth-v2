import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Heading } from '../../../../components/Heading';
import {
  InsuranceForm,
  Layout,
  UploadInsurance,
} from '../../../../components/Patient';
import { PaymentForm } from '../../../../components/Patient/PaymentForm';

const PaymentPage = () => {
  const router = useRouter();
  const [enterManually, setEnterManually] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <Heading>Payment</Heading>
        <p className="mt-2 mb-7 text-center text-dark">
          The price only indicates the price of the visit, not the price of any
          medication or treatment prescribed.
        </p>
        <p>Your cost for this visit:</p>
        <Heading>$72.00</Heading>
        <PaymentForm
          onSubmit={(formValue) => {
            router.push(`/patient/on-demand/payment/received`);
          }}
        />
      </div>
    </Layout>
  );
};

export default PaymentPage;
