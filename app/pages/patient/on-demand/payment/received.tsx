import React, { useState } from 'react';
import { Alert } from '../../../../components/Alert';
import { Layout } from '../../../../components/Patient';

const PaymentReceivedPage = () => {
  return (
    <Layout>
      <Alert
        title="Payment Received"
        icon={<img src="/icons/payment-success.svg" height={98} width={135} />}
        contentBeforeIcon
        content={
          <>
            <p className="mb-6">
              We’ve received your payment information, and will be using it to
              process this visit.
            </p>
          </>
        }
      />
    </Layout>
  );
};

export default PaymentReceivedPage;
