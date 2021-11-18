import { joinClasses } from '../../utils';
import { Button, ButtonVariant } from '../Button';
import { Select } from '../Select';
import { VirtualBackgroundOptions } from '../VirtualBackgroundOptions';
import { useEffect } from 'react';

export interface AudioVideoSettingsProps {
  className?: string;
  isDark?: boolean;
  isCallInProgress?: boolean;
  isRecording?: boolean;
  toggleRecording?: () => void;
}

export const AudioVideoSettings = ({
  className,
  isDark,
  isCallInProgress,
  isRecording,
  toggleRecording,
}: AudioVideoSettingsProps) => {

  // Gets machine's Audio and Video output
  useEffect(() => {
    //effect
    
    return () => {
      //cleanup
    }
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
          options={[{ value: 'System Default (Webcam)' }]}
        />
      </div>
      <div className="my-3">
        <Label>Voice Input Device:</Label>
        <Select
          isDark={isDark}
          className="w-full"
          options={[{ value: 'System Default (Headset Mic)' }]}
        />
        <input className="mt-4 w-full bg-primary" type="range" />
      </div>
      <div className="my-3">
        <Label>Audio Output Device:</Label>
        <Select
          isDark={isDark}
          className="w-full"
          options={[{ value: 'System Default (Speakers)' }]}
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
