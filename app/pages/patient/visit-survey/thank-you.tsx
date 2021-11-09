import React from 'react';
import { Alert } from '../../../components/Alert';
import { Layout } from '../../../components/Patient';

const VisitSurveyThankYouPage = () => {
  return (
    <Layout>
      <Alert
        title={`Thanks for your feedback`}
        titleAfterIcon
        icon={<img src="/icons/check-circle.svg" height={75} width={75} />}
        content={<p className="">You can close this window now.</p>}
      />
    </Layout>
  );
};

export default VisitSurveyThankYouPage;
