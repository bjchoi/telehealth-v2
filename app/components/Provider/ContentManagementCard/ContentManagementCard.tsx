import { Card } from '../../Card';
import { CardHeading } from '../CardHeading';
import { Select } from '../../Select';
import {EHRContent} from "../../../types";

export interface ContentManagementCardProps {
  className?: string;
  contentAssigned: EHRContent;
  contentAvailable: EHRContent[];
}

export const ContentManagementCard = ({
    className,
    contentAssigned,
    contentAvailable,
}: ContentManagementCardProps) => {
  return (
    <Card className={className}>
      <CardHeading>Content Management</CardHeading>
      <div className="px-2">
        <p className="mt-5 text-dark">
          Select content you’d like to play in the waiting room below:
        </p>
        <Select
          className="block w-full my-3 mx-auto"
          options={[{ value: 'Content Set 1 (default)' }]}
        />
      </div>
    </Card>
  );
};
