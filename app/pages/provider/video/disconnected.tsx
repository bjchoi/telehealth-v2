import React from 'react';
import { Card } from '../../../components/Card';
import { DisconnectedAlert } from '../../../components/DisconnectedAlert';
import { Layout } from '../../../components/Provider';

const DisconnectedPage = () => {
  return (
    <Layout>
      <Card className="py-10">
        <DisconnectedAlert />
      </Card>
    </Layout>
  );
};

export default DisconnectedPage;
