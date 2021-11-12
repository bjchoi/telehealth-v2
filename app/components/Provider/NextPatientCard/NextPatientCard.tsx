import { joinClasses } from '../../../utils';
import { Button } from '../../Button';
import { Card } from '../../Card';
import { CardHeading } from '../CardHeading';
import { Icon } from '../../Icon';

export interface NextPatientCardProps {
  className?: string;
}

const patient = {
  name: 'Sarah Cooper',
  waitTime: '00:23:14',
  gender: 'Female',
  language: 'English',
  reasonForVisit:
    "I think I twisted my ankle earlier this week when I jumped down some stairs but I can't tell, I attached a photo",
  preexistingConditions:
    "I've had exercise-induced asthma since childhood, but nothing else.",
  currentMedications: 'Albuterol, singulair, ibuprofen',
  translator: false,
  files: [{ name: 'twisted_ankle_photo.jpg' }],
};

export const NextPatientCard = ({ className }: NextPatientCardProps) => {
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

  return (
    <Card className={className}>
      <div className="font-bold text-xs">Next Patient:</div>
      <CardHeading>{patient.name}</CardHeading>
      <div className="font-bold text-light text-xs">
        Wait Time: {patient.waitTime}
      </div>
      <ul className="pl-5">
        <Field label="Reason for Visit" value={patient.reasonForVisit} />
        <Field label="Gender" value={patient.gender} />
        <Field label="Language" value={patient.language} />
        <Field label="Translator" value={patient.translator ? 'Yes' : 'No'} />
        <Field
          label="Preexisting Conditions"
          value={patient.preexistingConditions}
        />
        <Field label="Current Medications" value={patient.currentMedications} />
        {patient.files.length > 0 ? (
          <li>
            <label className="text-bold">Attached Files:</label>
            {patient.files.map((file, i) => (
              <a
                key={i}
                className="flex rounded-lg my-3 border border-link py-3 px-4 text-link text-xs items-center cursor-pointer"
                download
              >
                <span className="flex-grow underline">{file.name}</span>
                <Icon name="file_download" outline />
              </a>
            ))}
          </li>
        ) : (
          <Field label="Attached Files" value="None" />
        )}
      </ul>
      <div className="mt-5 text-center">
        <Button as="a" href="/provider/video">
          Start Visit
        </Button>
      </div>
    </Card>
  );
};
