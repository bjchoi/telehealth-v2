import { joinClasses } from '../../../utils';
import { Card } from '../../Card';
import { CardHeading } from '../CardHeading';

export interface PatientQueueCardProps {}

const patients = [
  {
    name: 'Sarah Cooper',
    waitingTime: '00:23:14',
    reasonForVisit:
      "I think I twisted my ankle earlier this week when I jumped down some stairs but I can't tell, I attached a photo",
  },
  {
    name: 'Green, Jakob',
    waitingTime: '00:19:32',
    reasonForVisit: 'Nose running, think I have a fever but not really sure',
  },
  {
    name: 'Owusu-Koramoah, Jeremiah',
    waitingTime: '00:12:54',
    reasonForVisit: "My shoulder has been bothering me and I'm can't raise it.",
  },
  {
    name: 'Harms, Alessandra',
    waitingTime: '00:11:03',
    reasonForVisit: "I have a headache that won't go away and a fever",
  },
  {
    name: 'Harrison, D’Andrea',
    waitingTime: '00:09:21',
    reasonForVisit:
      'Cut my finger with my pocket knife, got stuck in my finger',
  },
  {
    name: 'Kim, Dae',
    waitingTime: '00:08:43',
    reasonForVisit: 'My back hurts in the morning when I get out of bed',
  },
  {
    name: 'Odenigbo, Lupita',
    waitingTime: '00:07:24',
    reasonForVisit: "Coughing a lot, want to know if it's allergies or not",
  },
  {
    name: 'Washington, Lashawndrika',
    waitingTime: '00:06:42',
    reasonForVisit:
      'Have trouble with going to the bathroom, can we talk about it',
  },
  {
    name: 'Velasquez, Rodrigo',
    waitingTime: '00:04:11',
    reasonForVisit:
      "There’s this weird rash on my arm and I can't get rid of it",
  },
];

export const PatientQueueCard = ({}: PatientQueueCardProps) => {
  return (
    <Card>
      <CardHeading>Patient Queue</CardHeading>
      <div className="px-1 py-2 grid grid-cols-2 gap-4 font-bold text-xs">
        <div>Patient</div>
        <div>Reason For Visit:</div>
      </div>
      {patients.map((patient, i) => (
        <div
          key={i}
          className={joinClasses(
            'grid grid-cols-2 gap-4 font-bold text-xs px-1 py-2',
            i % 2 ? '' : 'bg-[#FAFAFA]'
          )}
        >
          <div>
            <a className="text-link underline">{patient.name}</a>
            <div className="font-bold text-light">
              Waiting {patient.waitingTime}
            </div>
          </div>
          <div className="line-clamp-2 overflow-ellipsis overflow-hidden text-dark">
            {patient.reasonForVisit}
          </div>
        </div>
      ))}
    </Card>
  );
};
