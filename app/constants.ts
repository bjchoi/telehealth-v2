import { LocalParticipant, RemoteParticipant } from "twilio-video";
import { Settings } from "./types";

export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'TwilioVideoApp-selectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'TwilioVideoApp-selectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'TwilioVideoApp-selectedVideoInput';

// This is used to store the current background settings in localStorage
export const SELECTED_BACKGROUND_SETTINGS_KEY = 'TwilioVideoApp-selectedBackgroundSettings';

export const STORAGE_USER_KEY = 'TelehealthUser';
export const STORAGE_VISIT_KEY = 'TelehealthVisit';
export const CURRENT_VISIT_ID = 'CurrentVisitId';

export const initialSettings: Settings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: 'standard',
  bandwidthProfileMode: 'collaboration',
  maxAudioBitrate: '16000',
  contentPreferencesMode: 'auto',
  clientTrackSwitchOffControl: 'auto',
  roomType: 'group'
};

export interface ParticipantRoomState {
  patientName: string;
  providerName: string;
}

export interface ProviderRoomState extends ParticipantRoomState {
  patientParticipant: RemoteParticipant;
  providerParticipant: LocalParticipant;
}

export interface PatientRoomState extends ParticipantRoomState {
  patientParticipant: LocalParticipant;
  providerParticipant: RemoteParticipant;
}