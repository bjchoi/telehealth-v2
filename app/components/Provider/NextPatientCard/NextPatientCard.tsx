import { joinClasses } from '../../../utils';
import { useEffect, useState } from 'react';
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
  visitNext: TelehealthVisit;
}


export const NextPatientCard = ({ className, visitNext }: NextPatientCardProps) => {
  const router = useRouter();
    const [ visitWaitTime, setVisitWaitTime ] = useState<string>();
    const [ visitNeedTranslator, setVisitNeedTranslator ] = useState<string>();

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
    clientStorage.saveToStorage(CURRENT_VISIT_ID, visitNext.ehrAppointment.id);
    router.push("/provider/video/");
  };

  useEffect(() => {
      const now : Date = new Date();
      const diffSeconds = Math.trunc(now.getTime() - visitNext.ehrAppointment.start_datetime_ltz.getTime());
      const hhmmdd = Math.trunc(diffSeconds/60/60).toString().padStart(2,'0')
          + Math.trunc(diffSeconds/60).toString().padStart(2,'0')
          + Math.trunc(diffSeconds % 60).toString().padStart(2,'0');
      setVisitWaitTime(hhmmdd);

      setVisitNeedTranslator(visitNext.ehrPatient.language === 'English' ? 'No' : 'Yes');
  }, []);

  return (
    <Card className={className}>
      <div className="font-bold text-xs">Next Patient:</div>
      <CardHeading>{visitNext.ehrPatient.name}</CardHeading>
      <div className="font-bold text-light text-xs">Wait Time: {visitWaitTime}</div>
      <ul className="pl-5">
        <Field label="Reason for Visit" value={visitNext.ehrAppointment.reason} />
        <Field label="Gender" value={visitNext.ehrPatient.gender} />
        <Field label="Language" value={visitNext.ehrPatient.language} />
        <Field label="Translator" value={visitNeedTranslator} />
        <Field
          label="Preexisting Conditions"
          value={visitNext.ehrPatient.conditions.join(', ')}
        />
        <Field label="Current Medications" value={visitNext.ehrPatient.medications.join(', ')} />
        {/*{visitNext.ehrAppointment.references.length > 0 ? (*/}
        {/*  <li>*/}
        {/*    <label className="text-bold">Attached Files:</label>*/}
        {/*    {visitNext.ehrAppointment.references.map((file, i) => (*/}
        {/*      <a*/}
        {/*        key={i}*/}
        {/*        className="flex rounded-lg my-3 border border-link py-3 px-4 text-link text-xs items-center cursor-pointer"*/}
        {/*        download*/}
        {/*      >*/}
        {/*        <span className="flex-grow underline">{file}</span>*/}
        {/*        <Icon name="file_download" outline />*/}
        {/*      </a>*/}
        {/*    ))}*/}
        {/*  </li>*/}
        {/*) : (*/}
        {/*  <Field label="Attached Files" value="None" />*/}
        {/*)}*/}
      </ul>
      <div className="mt-5 text-center">
        <Button as="button" onClick={startVisit}>
          Start Visit
        </Button>
      </div>
    </Card>
  );
};
