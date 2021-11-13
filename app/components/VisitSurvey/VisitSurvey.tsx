import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { joinClasses } from '../../utils';
import { Alert } from '../Alert';
import { Button, ButtonVariant } from '../Button';
import { Chips } from '../Chips';
import { Textarea } from '../Textarea';

export interface VisitSurveyProps {
  isProvider?: boolean;
}

type Reaction = 'thumb_up' | 'thumb_down';

const OPTIONS = [
  { value: "Couldn't hear" },
  { value: "Other's couldn't hear" },
  { value: 'Video was low quality' },
  { value: 'Video froze or was choppy' },
  { value: "Couldn't see participants" },
  { value: "Sound didn't match video" },
  { value: "Participants couldn't see me" },
  { value: 'Other issue' },
];

export const VisitSurvey = ({ isProvider }: VisitSurveyProps) => {
  const router = useRouter();
  const [selectedThumb, setSelectedThumb] = useState<Reaction>();
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [otherIssue, setOtherIssue] = useState<string>('');

  const ThumbIcon = ({ icon }: { icon: Reaction }) => (
    <Button
      className={joinClasses(
        'border-0',
        icon === selectedThumb && 'text-primary'
      )}
      variant={ButtonVariant.tertiary}
      outline
      icon={icon}
      iconClassName="text-4xl"
      iconType="outline"
      onClick={() => {
        setSelectedThumb(icon);
        setSelectedIssues([]);
        setOtherIssue('');

        if (icon === 'thumb_up') {
          submitFeedback();
        }
      }}
    />
  );

  function resetForm() {
    setSelectedThumb(undefined);
    setSelectedIssues([]);
    setOtherIssue('');
  }

  function submitFeedback(event = null) {
    event?.preventDefault();
    // TODO - Submit form to back-end
    console.log(selectedThumb, selectedIssues, otherIssue);
    fetch('/feedback-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selectedThumb,
        selectedIssues,
        otherIssue,
      })
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log("Error: ", err)
    });
    resetForm();
    router.push(
      `/${isProvider ? 'provider' : 'patient'}/visit-survey/thank-you`
    );
  }

  return (
    <Alert
      title="Thank you for your visit!"
      content={
        <form onSubmit={submitFeedback}>
          {isProvider ? (
            <p>If you don’t mind, could you tell us about your experience?</p>
          ) : (
            <p>
              We appreciate you scheduling a visit through the Owl Health app.
              If you don’t mind, could you tell us about how the visit went?
            </p>
          )}
          <p className="my-4 text-dark">How was the video and audio quality?</p>
          <div className="my-4 flex justify-evenly">
            <div>
              <ThumbIcon icon="thumb_up" />
            </div>
            <div>
              <ThumbIcon icon="thumb_down" />
            </div>
          </div>
          {selectedThumb === 'thumb_down' && (
            <div className="my-4">
              <Chips onChange={setSelectedIssues} options={OPTIONS} />
            </div>
          )}
          {selectedIssues.includes('Other issue') && (
            <div className="my-5">
              <Textarea
                className="w-full"
                rows={4}
                placeholder="Tell us more about the other issues you encountered during the call"
                value={otherIssue}
                onChange={(e) => setOtherIssue(e.target.value)}
              />
            </div>
          )}
          {selectedThumb === 'thumb_down' && !!selectedIssues.length && (
            <Button className="my-3" type="submit">
              Submit Feedback
            </Button>
          )}
        </form>
      }
    />
  );
};
