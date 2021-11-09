import React from 'react';
import { Alert } from '../Alert';
import { Button, ButtonVariant } from '../Button';

export interface DisconnectedAlertProps {}

export const DisconnectedAlert = () => {
  return (
    <Alert
      title={`You've lost connection\nto the visit`}
      icon={
        <img src="/icons/phone-disconnected.svg" height={128} width={128} />
      }
      content={
        <>
          <p className="mt-8 mb-5">
            Due to connection issues, you’ve been disconnected. Let’s get you
            back on track:
          </p>

          <p className="my-5">
            Rejoin the call or, if issues persist, you can switch to a phone
            consultation.
          </p>
        </>
      }
      footer={
        <>
          <Button
            as="a"
            href="/patient/video"
            className="my-1 max-w-[272px] w-full mx-auto"
          >
            Rejoin Video Visit
          </Button>
          <Button
            className="my-1 max-w-[272px] w-full mx-auto"
            variant={ButtonVariant.secondary}
            outline
          >
            Switch to Phone Consultation
          </Button>
        </>
      }
    />
  );
};
