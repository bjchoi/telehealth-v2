import React, { useEffect, useState } from "react";
import VideoProvider from "../Base/VideoProvider";
import useConnectionOptions from "../Base/VideoProvider/useConnectionOptions/useConnectionOptions";
import { useVisitContext, VisitStateProvider } from "../../state/VisitContext";
import useVideoContext from "../Base/VideoProvider/useVideoContext/useVideoContext";

 function VideoProviderChildrenWrapper(props: React.PropsWithChildren<{}>) {
    const { user } = useVisitContext();
    const { getAudioAndVideoTracks, localTracks } = useVideoContext();
    const [mediaError, setMediaError] = useState<Error>();
  
    useEffect(() => {
      if (!mediaError) {
        getAudioAndVideoTracks().catch(error => {
          console.log('Error acquiring local media:');
          console.dir(error);
          setMediaError(error);
        });
      }
    }, [getAudioAndVideoTracks, mediaError]);
    return (
      user && (localTracks && localTracks.length > 0) &&
      <>
        { props.children }
      </>
    );
  }
  
  
  export function ProviderVideoContextLayout(props: React.PropsWithChildren<{}>) {
    const connectionOptions = useConnectionOptions();
    return (
      <VisitStateProvider>
        <VideoProvider options={connectionOptions} onError={(error) => console.log(error)}>
          <VideoProviderChildrenWrapper>
            { props.children }
          </VideoProviderChildrenWrapper>
        </VideoProvider>
      </VisitStateProvider>
    );
  }
  
  export default ProviderVideoContextLayout;
  