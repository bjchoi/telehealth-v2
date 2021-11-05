export interface PatientHeaderProps {
  name?: string;
}

export const PatientHeader = ({ name = 'Owl Health' }: PatientHeaderProps) => {
  return (
    <div className="flex items-center justify-center h-16 w-full bg-white shadow-patientHeader">
      <div className="font-bold text-2xl text-primary">{name}</div>
    </div>
  );
};
