import React from 'react';
import { AlertPage } from '../../../components/AlertPage';
import { Button, ButtonVariant } from '../../../components/Button';

const NoAvPermissionPage = () => {
  return (
    <AlertPage
      title={`To use Owl Health, we need\nyour permissions`}
      icon={<img src="/icons/no-av-permissions.svg" height={114} width={262} />}
      content={
        <>
          <p className="my-5">
            In order to continue with a video visit, we need your permissions to
            use your camera and microphone.
          </p>

          <p className="my-5">
            If you prefer not to give permission, you canbtalk to the provider
            instead with a phone consultation.
          </p>
        </>
      }
      footer={
        <>
          <Button className="my-1 max-w-[272px] w-full mx-auto">
            Give Permission
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

export default NoAvPermissionPage;
