import { joinClasses } from '../../utils';
import { Button, ButtonVariant } from '../Button';
import { Select } from '../Select';
import { VirtualBackgroundOptions } from '../VirtualBackgroundOptions';
import { useEffect, useState } from 'react';
import { connect, createLocalTracks } from 'twilio-video';

export interface AudioVideoSettingsProps {
  className?: string;
  isDark?: boolean;
  isCallInProgress?: boolean;
  isRecording?: boolean;
  toggleRecording?: () => void;
}

export interface Device {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;
}

export const AudioVideoSettings = ({
  className,
  isDark,
  isCallInProgress,
  isRecording,
  toggleRecording,
}: AudioVideoSettingsProps) => {
  const [videoDevices, setVideoDevices] = useState<ReadonlyArray<Device>>([]);
  const [audioInputDevices, setAudioInputDevices] = useState<ReadonlyArray<Device>>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<ReadonlyArray<Device>>([]);  
  
  // Gets machine's Audio and Video devices
  useEffect(() => {
    console.log("useEffect");
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInputDevices: Device[] = devices.filter(device => device.kind === 'videoinput');
      const audioInputs: Device[] = devices.filter(device => device.kind === 'audioinput' && !device.label.includes("Virtual"));
      const audioOutputs: Device[] = devices.filter(device => device.kind === 'audiooutput' && !device.label.includes("Virtual"));
      console.log("useEffect2");
      setVideoDevices(videoInputDevices);
      setAudioInputDevices(audioInputs);
      setAudioOutputDevices(audioOutputs);
    })
  }, [])

  const Label = ({ children }) => (
    <label
      className={joinClasses(
        'my-2 text-xs block',
        isDark ? 'text-white' : 'text-dark'
      )}
    >
      {children}
    </label>
  );

  return (
    <div className={joinClasses(className)}>
      <div className="my-3">
        <Label>Virtual Background</Label>
        <VirtualBackgroundOptions isDark={isDark} />
      </div>
      <div className="my-3">
        <Label>Camera</Label>
        <Select
          isDark={isDark}
          className="w-full"
          options={videoDevices.map(device => (
            { 
              label: device.label ? device.label : "System Default (Webcam)",
              value: device.deviceId
            }))
          }
        />
      </div>
      <div className="my-3">
        <Label>Voice Input Device:</Label>
        <Select
          isDark={isDark}
          className="w-full"
          options={audioInputDevices.map(device => ({label: device.label, value: device.deviceId}))}
        />
        <input className="mt-4 w-full bg-primary" type="range" />
      </div>
      <div className="my-3">
        <Label>Audio Output Device:</Label>
        <Select
          isDark={isDark}
          className="w-full"
          options={audioOutputDevices.map(device => ({label: device.label, value: device.deviceId}))}
        />
        <input className="mt-4 w-full bg-primary" type="range" />
      </div>
      {isCallInProgress ? (
        <div className="my-6 flex items-center">
          <div className="pr-5 text-sm">Recording:</div>
          <div className="flex-grow">
            <Button
              variant={isRecording ? ButtonVariant.primary : ButtonVariant.link}
              className="w-full"
              onClick={toggleRecording}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="my-3">
          <Button variant={ButtonVariant.tertiary} outline>
            Mic Test
          </Button>
        </div>
      )}

      <div className="my-5 font-bold text-center text-xs">
        Saved to your Twilio account
      </div>
    </div>
  );
};
