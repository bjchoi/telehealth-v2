import React from 'react';
import { Card } from '../../../components/Card';
import { Layout } from '../../../components/Provider';
import { VisitSurvey } from '../../../components/VisitSurvey';

const VisitSurveyPage = () => {
  return (
    <Layout>
      <Card>
        <VisitSurvey isProvider />
      </Card>
    </Layout>
  );
};

export default VisitSurveyPage;
