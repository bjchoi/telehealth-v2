import React, { useEffect } from 'react';
import useVideoContext from '../../../components/Base/VideoProvider/useVideoContext/useVideoContext';
import { VideoConsultation } from '../../../components/Provider';
import { useVisitContext } from '../../../state/VisitContext';
import { useRouter } from 'next/router';
import { roomService } from '../../../services/roomService';
import { TelehealthUser, TwilioPage } from '../../../types';
import clientStorage from '../../../services/clientStorage';
import { CURRENT_VISIT_ID } from '../../../constants';
import ProviderVideoContextLayout from '../../../components/Provider/ProviderLayout';
import useChatContext from '../../../components/Base/ChatProvider/useChatContext/useChatContext';

const VideoPage: TwilioPage = () => {
  const { user, visit } = useVisitContext();
  const { connect: videoConnect, room } = useVideoContext();
  const { connect: chatConnect } = useChatContext();
  const router = useRouter();

  useEffect(() => {
    if(!room) {
      clientStorage.getFromStorage<string>(CURRENT_VISIT_ID)
        .then(roomName => {
          roomService.createRoom(user as TelehealthUser, roomName)
          .then(async roomTokenResp => {
            if(!roomTokenResp.roomAvailable) {
              router.push('/provider/dashboard');
            }
            await videoConnect(roomTokenResp.token); 
            chatConnect(roomTokenResp.token);
          });
        });
    }
  },[router, room]);

  return <VideoConsultation />;
};

VideoPage.Layout = ProviderVideoContextLayout;
export default VideoPage;
