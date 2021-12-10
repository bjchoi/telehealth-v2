import React, { useEffect, useState } from 'react';
import { Alert } from '../../../../components/Alert';
import { Button } from '../../../../components/Button';
import { Layout } from '../../../../components/Patient';
import { useRouter } from 'next/router';
import { Uris } from '../../../../services/constants';

/* 
* After landing on this page, a visitId should be created from EHR
* - Payment is valid, and POST request sent to EHR
* - EHR sends back a visitId
* - This page creats a token with the visitId attached
**/
const PaymentReceivedPage = () => {
  const router = useRouter();
  const [passcode, setPasscode] = useState<string>();
  const [isError, setIsError] = useState<boolean>(false);

  // The values in this fetch statement will be gathered from EHR integration
  useEffect(() => {
    fetch(Uris.get(Uris.visits.token), {
      method: 'POST',
      body: JSON.stringify({
        role: "patient",
        action: "PATIENT",
        id: "John",
        visitId: "v-doe-jonson-1121" // should be generated from EHR
      }),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
    .then(async token => {
      const resolvedToken = await token.json();
      setPasscode(resolvedToken.passcode);
    }).catch(err => {
      setIsError(true);
      new Error(err);
    })
  }, [])

  const enterWaitingRoom = () => {
    router.push(`/patient?token=${passcode}`);
  }

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
      <div className="my-5 mx-auto max-w-[250px] w-full">
        <Button type="submit" disabled={isError} className="w-full" onClick={enterWaitingRoom}>
          Connect to Waiting Room
        </Button>
      </div>
    </Layout>
  );
};

export default PaymentReceivedPage;
