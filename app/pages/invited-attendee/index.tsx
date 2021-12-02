import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Layout } from '../../components/Patient';
import { Select } from '../../components/Select';
import { STORAGE_USER_KEY, STORAGE_VISIT_KEY } from '../../constants';
import clientStorage from '../../services/clientStorage';
import visitorAuth from '../../services/visitorAuthService';
import visitService from '../../services/visitService';

const InvitedAttendeePage = () => {
  const router = useRouter();
  useEffect(() => {
    var token = router.query.token as string;
    if(token) {
      visitorAuth.authenticateVisitor(token)
      .then(u => {
        clientStorage.saveToStorage(STORAGE_USER_KEY, u);
        return visitService.getVisitForPatient(u);
      }).then(v => {
        if(v) {
          clientStorage.saveToStorage(STORAGE_VISIT_KEY, v);
        }
      });
      // TODO: Implement CATCH
    }
  }, [router]);


  return (
    <Layout>
      <Alert
        title="Welcome"
        content={
          <>
            <p className="mb-6">
              Thanks for coming to support Sarah Cooper. Please share some
              information about yourself below for Dr. Josefina Santos:
            </p>
            <div className="">
              <Input className="w-full my-2" placeholder="Full Name" />
              <Select
                className="w-full my-2"
                placeholder="Relationship with Patient"
                options={[
                  { value: 'Caregiver' },
                  { value: 'Family Member' },
                  { value: 'Other' },
                ]}
              />
              <div className="text-left">
                <label className="text-light">
                  <input type="checkbox" /> I agree to the Terms & Conditions
                </label>
              </div>
              <div>
                <Button
                  as="a"
                  href="/invited-attendee/technical-check/"
                  className="inline-block w-full mt-3 mb-1"
                >
                  Continue
                </Button>

                <a className="text-link">Terms & Conditions</a>
              </div>
            </div>
          </>
        }
      />
    </Layout>
  );
};
export default InvitedAttendeePage;
