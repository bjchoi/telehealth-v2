import { joinClasses } from '../../utils';
import { Button, ButtonVariant } from '../Button';

export interface VideoControlsProps {
  containerClass?: string;
  addParticipant: () => void;
  flipCamera: () => void;
  toggleAudio: () => void;
  toggleChat: () => void;
  toggleVideo: () => void;
}

export const VideoControls = ({
  containerClass,
  addParticipant,
  flipCamera,
  toggleAudio,
  toggleChat,
  toggleVideo,
}: VideoControlsProps) => {
  return (
    <div
      className={joinClasses(
        'w-full max-w-[368px] mx-auto flex px-3 py-4 justify-between',
        containerClass
      )}
    >
      <Button
        icon="person_add"
        variant={ButtonVariant.tertiary}
        onClick={addParticipant}
      />
      <Button
        icon="chat_bubble_outline"
        variant={ButtonVariant.tertiary}
        onClick={toggleChat}
      />
      <Button
        icon="videocam"
        variant={ButtonVariant.tertiary}
        onClick={toggleVideo}
      />
      <Button
        icon="mic"
        variant={ButtonVariant.tertiary}
        onClick={toggleAudio}
      />
      <Button
        icon="flip_camera_ios"
        variant={ButtonVariant.tertiary}
        onClick={flipCamera}
      />
      <Button as="a" href="/patient/video/disconnected" icon="call_end" />
    </div>
  );
};
