import type { AppProps } from 'next/app';
import VideoProviderWrapper from '../components/Base/VideoProvider';
import withVideoProvider from '../components/Base/VideoProvider';
import '../css/global.css';
import AppStateProvider, { useAppState } from '../state';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppStateProvider>
      <VideoProviderWrapper>
        <Component {...pageProps} />
      </VideoProviderWrapper>
    </AppStateProvider>
  );
}

export default MyApp;
