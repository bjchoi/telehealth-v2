import React, { useState } from 'react';
import { Button, ButtonVariant } from '../../components/Button';
import { DateTime } from '../../components/DateTime';
import { Heading } from '../../components/Heading';
import { Layout } from '../../components/Patient';
import { TechnicalCheck } from '../../components/TechnicalCheck';

const data = {
  date: new Date(),
  doctorName: 'Dr. Josefina Santos',
};

const TechnicalCheckPage = () => {
  return (
    <Layout>
      <div className="my-4 flex flex-col items-center justify-center">
        <Heading>Invited to Appointment</Heading>
        <div className="mb-2 text-secondary">{data.doctorName}</div>
        <TechnicalCheck videoImage="/invited-attendee.svg" />
        <Button className="my-2 px-8">Continue to Visit</Button>
        <div className="flex items-center justify-center bg-secondary text-white text-2xl h-[200px] w-full m-2">
          Content Area
        </div>
      </div>
    </Layout>
  );
};

export default TechnicalCheckPage;
