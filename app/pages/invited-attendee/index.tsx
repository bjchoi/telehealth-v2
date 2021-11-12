import React from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Layout } from '../../components/Patient';
import { Select } from '../../components/Select';

const InvitedAttendeePage = () => {
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
