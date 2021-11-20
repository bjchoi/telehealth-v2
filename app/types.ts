import { LocalVideoTrack, RemoteVideoTrack, Track, TwilioError, VideoBandwidthProfileOptions } from 'twilio-video';
import { NextPage } from 'next';
import React from 'react';

export type TwilioPage = NextPage & { Layout?: React.FC }

export type TelehealthRole = 'guest' | 'patient' | 'visitor' | 'practitioner';

export interface TelehealthUser {
  name: string
  isAuthenticated: Boolean
  role: TelehealthRole,
  token: string
}

export interface PatientUser extends TelehealthUser {
  visitId: string
}

export const GuestUser = {
  name: "Guest",
  isAuthenticated: false,
  role: "guest",
  token: null
} as TelehealthUser;

export interface TelehealthVisit {
  id: string,
  visitDateTime: Date,
  providerName: string,
  roomName: string,
  patientName: string
}

declare module 'twilio-video' {
  // These help to create union types between Local and Remote VideoTracks
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }
}

declare global {

  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }

  // Helps create a union type with TwilioError
  interface Error {
    code: undefined;
  }
}

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError | Error) => void;

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

export type RoomType = 'group' | 'group-small' | 'peer-to-peer' | 'go';

export interface Settings {
  trackSwitchOffMode: VideoBandwidthProfileOptions['trackSwitchOffMode'];
  dominantSpeakerPriority?: Track.Priority;
  bandwidthProfileMode: VideoBandwidthProfileOptions['mode'];
  maxAudioBitrate: string;
  contentPreferencesMode?: 'auto' | 'manual';
  clientTrackSwitchOffControl?: 'auto' | 'manual';
  roomType: RoomType
}

type SettingsKeys = keyof Settings;

export interface SettingsAction {
  name: SettingsKeys;
  value: string;
}