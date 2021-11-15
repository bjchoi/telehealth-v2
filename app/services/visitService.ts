import { TelehealthUser, TelehealthVisit } from "../types";
import { Uris } from './constants'

const visits = [
  {
    id: 'v-doe-jonson-1121',
    providerName: 'Dr. John Doe',
    patientName: 'Kelly Jonsons',
    roomName: 'v-doe-jonson-1121',
    visitDateTime: new Date()
  } as TelehealthVisit,
  {
    id: 'v-doe-peterson-1121',
    providerName: 'Dr. John Doe',
    patientName: 'Paul Peterson',
    roomName: 'v-doe-peterson-1121',
    visitDateTime: new Date()
  } as TelehealthVisit
];

function getVisits(provider: TelehealthUser): Promise<Array<TelehealthVisit> | { error : string }> {
  if(provider.role !== 'provider') {
    Promise.reject({ error: "Only provider can get a list of visits" });
  }

  return Promise.resolve(visits);
}

function getVisit(id: string): Promise<TelehealthVisit | { error : string }> {
  return Promise.resolve(visits.find(v => v.id === id));
}

function getVisitForPatient(patient: TelehealthUser): Promise<TelehealthVisit | { error : string }> {
  if(patient.role !== 'patient') {
    Promise.reject({ error: "Only patient or visitor should be used" });
  }

  return Promise.resolve(visits.find(v => v.patientName === patient.name));
}

export default {
  getVisits,
  getVisit,
  getVisitForPatient
};