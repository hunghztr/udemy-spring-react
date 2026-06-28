import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Box } from '@mui/material';

export default function HlsVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = src;
    }
  }, [src]);

  return (
    <Box
      component="video"
      ref={videoRef}
      controls
      autoPlay
      sx={{ width: '100%', borderRadius: 2, background: 'black' }}
    />
  );
}