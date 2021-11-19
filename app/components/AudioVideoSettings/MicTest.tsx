import { joinClasses } from '../../utils';
import { createLocalAudioTrack, LocalAudioTrack, Track } from 'twilio-video';
import { useEffect, useState } from 'react';
import { Icon } from '../Icon';

interface MicTestProps {
  className: string;
  isMicOn: boolean;
}

/**
 * TODO:
 * - Configure Microphone testing
 * - Show "Progress Bar" for audio levels
 * 
 */
function MicTest({className, isMicOn}: MicTestProps) {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [fraction, setFraction] = useState<number>(1);

  const pollAudioLevel = async (localAudioTrack: Promise<LocalAudioTrack>, onLevelChanged) => {
    const audioContext = new AudioContext();
    const audioTrack = await localAudioTrack;

    if (!audioContext) return;
    try {
      await audioContext.resume();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.95;

      const stream = new MediaStream([audioTrack.mediaStreamTrack]);
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const samples = new Uint8Array(analyser.frequencyBinCount);
      let level = null;
    
      requestAnimationFrame(function checkLevel() {
        analyser.getByteFrequencyData(samples);
        let sumSq = samples.reduce((sumSq, sample) => sumSq + sample * sample, 0);
        sumSq = Math.sqrt(sumSq / samples.length);
        const log2Rms = sumSq && Math.log2(sumSq);

        // Now determine audio level
        const newLevel = Math.ceil(100 * log2Rms / 8);
        if (level !== newLevel) {
          level = newLevel;
          onLevelChanged(level);
        }

        if (audioTrack.mediaStreamTrack.readyState === 'live') {
          requestAnimationFrame(checkLevel);
        } else {
          requestAnimationFrame(() => onLevelChanged(0));
        }
      });

      return await source;
    } catch (err) {
      console.log(err)
    }
  }
  
  useEffect(() => {
    if (!isMicOn) return
    const localAudioTrack = createLocalAudioTrack();
    const source = pollAudioLevel(localAudioTrack, level => {
      setAudioLevel(level);
      const frac = Math.floor(level * (12 / 100));
      setFraction(frac);
    }).then(v => v)
    return () => {
      if (!isMicOn) source.then(r => r.disconnect);
    }
  }, [isMicOn]);

  return (
    <div className={joinClasses(className, " space-x-2")}>
      {/* {audioLevel} */}
      <div className='mic-container rounded-lg h-10 width:10px bg-gray-200'>
        <div className={`h-10 w-${"1"}/12 rounded bg-green-400`}>
          <span>{}</span>
        </div>
      </div>
      {/* <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div>
      <div className="bar h-10 w-3 bg-gray-200"></div> */}
    </div>
    
  )
}

export default MicTest;
