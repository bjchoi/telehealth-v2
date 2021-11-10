import React from 'react';
import { DisconnectedAlert } from '../../../components/DisconnectedAlert';
import { CardLayout } from '../../../components/Provider';

const DisconnectedPage = () => {
  return (
    <CardLayout>
      <DisconnectedAlert />
    </CardLayout>
  );
};

export default DisconnectedPage;
