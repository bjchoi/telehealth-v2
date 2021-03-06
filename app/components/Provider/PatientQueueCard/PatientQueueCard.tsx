import { joinClasses } from '../../../utils';
import { useEffect } from 'react';
import { Card } from '../../Card';
import { CardHeading } from '../CardHeading';
import {TelehealthVisit} from "../../../types";

export interface PatientQueueCardProps {
  className?: string;
  visitQueue: TelehealthVisit[];
}

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

function calculateWaitTime(visitStartTimeLTZ) {
  const now : Date = new Date();
  const diffSeconds = Math.trunc((now.getTime() - visitStartTimeLTZ.getTime())/1000);
  const hhmmdd = Math.trunc(diffSeconds/60/60).toString().padStart(2,'0')
      + ':' + Math.trunc(diffSeconds/60).toString().padStart(2,'0')
      + ':' + Math.trunc(diffSeconds % 60).toString().padStart(2,'0');

  return (diffSeconds > 0 ? 'Waiting ': 'Starting ') + hhmmdd;
}

export const PatientQueueCard = ({ className, visitQueue }: PatientQueueCardProps) => {

  useEffect(() => {
    console.log('PatientQueueCard visitQueue=', visitQueue);
  }, []);

  return (
    <Card className={className}>
      <CardHeading>Patient Queue</CardHeading>
      <div className="px-1 py-2 grid grid-cols-2 gap-4 font-bold text-xs">
        <div>Patient</div>
        <div>Reason For Visit:</div>
      </div>
      {visitQueue.map((visit, i) => (
        <div
          key={i}
          className={joinClasses(
            'grid grid-cols-2 gap-4 font-bold text-xs px-1 py-2',
            i % 2 ? '' : 'bg-[#FAFAFA]'
          )}
        >
          <div>
            <a className="text-link underline">{visit.ehrPatient.name}</a>
            <div className="font-bold text-light">
              { calculateWaitTime(visit.ehrAppointment.start_datetime_ltz) }
            </div>
          </div>
          <div className="line-clamp-2 overflow-ellipsis overflow-hidden text-dark">
            {visit.ehrAppointment.reason}
          </div>
        </div>
      ))}
    </Card>
  );
};
