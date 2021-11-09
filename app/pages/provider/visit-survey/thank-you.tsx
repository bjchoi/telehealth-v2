import React from 'react';
import { Alert } from '../../../components/Alert';
import { Card } from '../../../components/Card';
import { Layout } from '../../../components/Provider';

const VisitSurveyThankYouPage = () => {
  return (
    <Layout>
      <Card>
        <Alert
          title={`Thanks for your feedback`}
          titleAfterIcon
          icon={<img src="/icons/check-circle.svg" height={75} width={75} />}
          content={<p className="">You can close this window now.</p>}
        />
      </Card>
    </Layout>
  );
};

export default VisitSurveyThankYouPage;
