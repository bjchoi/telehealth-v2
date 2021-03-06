import React, { useEffect, useState } from 'react';
import { Participant, Track } from 'twilio-video';
import Publication from './Publication/Publication';
import usePublications from './usePublications/usePublications';

interface ParticipantTracksProps {
  participant: Participant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
  isLocalParticipant?: boolean;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

export default function ParticipantTracks({
  participant,
  videoOnly,
  enableScreenShare,
  videoPriority,
  isLocalParticipant,
}: ParticipantTracksProps) {
  const publications = usePublications(participant);
  const [filteredPublications, setFilteredPublications] = useState([]);

useEffect(() => {
  if (enableScreenShare && publications.some(p => p.trackName.includes('screen'))) {
    setFilteredPublications(publications.filter(p => !p.trackName.includes('camera')));
  } else {
    setFilteredPublications(publications.filter(p => !p.trackName.includes('screen')));
  }
},[publications]);

  return (
    <>
      {filteredPublications.map(publication => (
        <Publication
          key={publication.kind}
          publication={publication}
          participant={participant}
          isLocalParticipant={isLocalParticipant}
          videoOnly={videoOnly}
          videoPriority={videoPriority}
        />
      ))}
    </>
  );
}
