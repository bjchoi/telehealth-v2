export interface PoweredByTwilioProps {
  className?: string;
  inverted?: boolean;
}

export const PoweredByTwilio = ({
  className,
  inverted,
}: PoweredByTwilioProps) => {
  return inverted ? (
    <img
      className={className}
      src="/powered-by-twilio-white.svg"
      width={126}
      height={19}
    />
  ) : (
    <img
      className={className}
      src="/powered-by-twilio.svg"
      width={150}
      height={40}
    />
  );
};
