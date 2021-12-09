import { joinClasses } from '../../../utils';
import { useEffect } from 'react';
import { Button } from '../../Button';
import { Card } from '../../Card';
import { CardHeading } from '../CardHeading';
import { Icon } from '../../Icon';
import { useRouter } from 'next/router';
import clientStorage from '../../../services/clientStorage';
import {CURRENT_VISIT_ID, STORAGE_VISIT_KEY} from '../../../constants';
import {TelehealthVisit} from "../../../types";

export interface NextPatientCardProps {
  className?: string;
}


export const NextPatientCard = ({ className }: NextPatientCardProps) => {
  const router = useRouter();

  const Field = ({ label, value }) => (
    <li className="my-4 text-xs">
      <label className="font-bold">{label}:</label>
      <div
        className={joinClasses(
          'text-dark',
          value.match(/\s/) ? '' : 'inline-block ml-1'
        )}
      >
        {value}
      </div>
    </li>
  );

  function startVisit() {
    // TODO: Change to TelehealthVisit.id
    // to reduce abstraction.
    clientStorage.saveToStorage(CURRENT_VISIT_ID, ehrAppointment.id);
    router.push("/provider/video/");
  };

// TODO: turn into properties to be loaded from server
    const ehrPatient = {
    id: 'p1000000',
    name: 'Sarah Cooper',
    start_datetime_ltz: '00:23:14',
    gender: 'Female',
    language: 'English',
    conditions: [
        "I've had exercise-induced asthma since childhood, but nothing else.",
    ],
    medications: [ 'Albuterol', 'singulair', 'ibuprofen'],
    };

    const ehrAppointment = {
    id: 'a1000000',
    reason: "I think I twisted my ankle earlier this week when I jumped down some stairs but I can't tell, I attached a photo",
    references: ['twisted_ankle_photo.jpg'],
    };

  useEffect(() => {
      const tv =  clientStorage.getFromStorage<TelehealthVisit>(STORAGE_VISIT_KEY);
      
  }, []);

  return (
    <Card className={className}>
      <div className="font-bold text-xs">Next Patient:</div>
      <CardHeading>{ehrPatient.name}</CardHeading>
      <div className="font-bold text-light text-xs">
        Wait Time: {ehrPatient.start_datetime_ltz}
      </div>
      <ul className="pl-5">
        <Field label="Reason for Visit" value={ehrAppointment.reason} />
        <Field label="Gender" value={ehrPatient.gender} />
        <Field label="Language" value={ehrPatient.language} />
        <Field label="Translator" value={ehrPatient.language === 'English' ? 'No' : 'Yes'} />
        <Field
          label="Preexisting Conditions"
          value={ehrPatient.conditions.join(', ')}
        />
        <Field label="Current Medications" value={ehrPatient.medications.join(', ')} />
        {ehrAppointment.references.length > 0 ? (
          <li>
            <label className="text-bold">Attached Files:</label>
            {ehrAppointment.references.map((file, i) => (
              <a
                key={i}
                className="flex rounded-lg my-3 border border-link py-3 px-4 text-link text-xs items-center cursor-pointer"
                download
              >
                <span className="flex-grow underline">{file}</span>
                <Icon name="file_download" outline />
              </a>
            ))}
          </li>
        ) : (
          <Field label="Attached Files" value="None" />
        )}
      </ul>
      <div className="mt-5 text-center">
        <Button as="button" onClick={startVisit}>
          Start Visit
        </Button>
      </div>
    </Card>
  );
};
