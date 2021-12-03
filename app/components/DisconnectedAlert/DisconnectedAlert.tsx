import React, { useState, useEffect } from 'react';
import { Alert } from '../Alert';
import { Button, ButtonVariant } from '../Button';
import clientStorage from '../../services/clientStorage';
import { STORAGE_USER_KEY } from '../../constants';
import { TelehealthUser } from '../../types';
import Link from 'next/link';

export interface DisconnectedAlertProps {}

export const DisconnectedAlert = () => {
  
  const [userRole, setUserRole] = useState<string>('');
  
  useEffect(() => {
    clientStorage.getFromStorage<TelehealthUser>(STORAGE_USER_KEY)
        .then(user => setUserRole(user.role))
        .catch(error => {
          new Error("Error getting Telehealth User from Storage: ", error);
        });
  }, []);

  function handleclick() {
    console.log(userRole);
  }

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
          <Link href={`/${userRole}/video`}>
            <Button
              as="a"
              href={`/${userRole}/video`}
              className="my-1 max-w-[272px] w-full mx-auto"
              onClick={handleclick}
            >
              Rejoin Video Visit
            </Button>
          </Link>
          <Button
            className="my-1 max-w-[272px] w-full mx-auto"
            variant={ButtonVariant.secondary}
            outline
            onClick={handleclick}
          >
            Switch to Phone Consultation
          </Button>
        </>
      }
    />
  );
};
