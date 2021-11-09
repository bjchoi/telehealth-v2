import { joinClasses } from '../../utils';

export interface ModalProps {
  backdropClick?: () => void;
  children: React.ReactNode;
  isVisible: boolean;
}

export const Modal = ({ backdropClick, children, isVisible }: ModalProps) => {
  return (
    <div
      className={joinClasses(
        'fixed inset-0 z-50 overflow-auto bg-[#000000BF] flex items-center justify-center',
        !isVisible && 'hidden'
      )}
      onClick={backdropClick}
    >
      <div
        className="relative bg-white w-full mx-10 max-w-sm m-auto rounded-lg"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};
