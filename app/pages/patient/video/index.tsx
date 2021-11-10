import React, { useEffect } from 'react';
import withVideoProvider from '../../../components/Base/VideoProvider';
import useVideoContext from '../../../components/Base/VideoProvider/useVideoContext/useVideoContext';
import { VideoConsultation } from '../../../components/Patient';
import { useAppState } from '../../../state';

const VideoPage = () => {
  const { getToken } = useAppState();
  const { connect: videoConnect, room } = useVideoContext();
  const userName = "P" + Math.floor(Math.random()*100);
  const roomName = "TestRoom";
  useEffect(() => {
    if(!room) {
      getToken(userName, roomName).then(({ token }) => {
        videoConnect(token);
        // process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
      });
    }
  },[room]);
  return <VideoConsultation />;
};

export default VideoPage;
