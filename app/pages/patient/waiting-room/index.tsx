import React from 'react';
import { Button, ButtonVariant } from '../../../components/Button';
import { DateTime } from '../../../components/DateTime';
import { Heading } from '../../../components/Heading';
import { Layout } from '../../../components/Patient';

const data = {
  date: new Date(),
  doctorName: 'Dr. Josefina Santos',
};

const WaitingRoomPage = () => {
  return (
    <Layout>
      <div className="my-4 flex flex-col items-center justify-center">
        <Heading>Your Appointment</Heading>
        <div className="mb-2 text-secondary">{data.doctorName}</div>
        <DateTime date={data.date} />
        <div className="flex mt-4 mb-1">
          <div className="flex flex-col justify-center px-1">
            <Button
              className="my-2"
              icon="flip_camera_ios"
              iconType="outline"
              variant={ButtonVariant.tertiary}
            />
            <Button
              className="my-2"
              icon="videocam"
              iconType="outline"
              variant={ButtonVariant.tertiary}
            />
            <Button
              className="my-2"
              icon="mic"
              iconType="outline"
              variant={ButtonVariant.tertiary}
            />
          </div>
          <div className="flex-grow px-1">
            <img src="/patient.jpg" alt="Patient" width={187} height={250} />
          </div>
        </div>
        <div className="text-tertiary">
          Your visit will start when the provider joins
        </div>
        <div className="flex items-center justify-center bg-secondary text-white text-2xl h-[200px] w-full m-2">
          Content Area
        </div>
        <Button
          as="a"
          href="/patient/video"
          className="mt-2 px-8"
          variant={ButtonVariant.secondary}
          outline
        >
          Leave Waiting Room
        </Button>
      </div>
    </Layout>
  );
};

export default WaitingRoomPage;
