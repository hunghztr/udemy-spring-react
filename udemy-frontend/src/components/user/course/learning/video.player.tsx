import { Box, Paper, Typography } from "@mui/material";
import Hls from "hls.js";
import { useEffect, useRef } from "react";
import type { ILectureResponse } from "@/type/course.module";
import { useAppSelector } from "@/redux/hook";

interface Props {
  lecture: ILectureResponse | null;
}

export default function VideoPlayer({ lecture }: Props) {
  const username = useAppSelector(state => state.currentUser.username)
  const progressKey = `${username}-lecture-progress-${lecture?.id}`;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {

    if (!lecture || !videoRef.current) return;

    const video = videoRef.current;

    const src =
      `${import.meta.env.VITE_CLOUDINARY_WATCH_VIDEO}/${lecture.path}.m3u8`;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();

    if (Hls.isSupported()) {

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {

        const savedTime = localStorage.getItem(progressKey);

        if (savedTime) {
          video.currentTime = Number(savedTime);
        }

        video.play().catch(()=>{});
      });

    } 
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {

      video.src = src;

      video.addEventListener("loadedmetadata", () => {

        const savedTime = localStorage.getItem(progressKey);

        if (savedTime) {
          video.currentTime = Number(savedTime);
        }

        video.play().catch(()=>{});
      });

    }

    const saveProgress = () => {

      const current = video.currentTime;

      if(current > 1){ // tránh ghi 0
        localStorage.setItem(progressKey, String(current));
      }

    };

    video.addEventListener("timeupdate", saveProgress);

    return () => {

      video.removeEventListener("timeupdate", saveProgress);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

    };

  }, [lecture]);
  return (
    <Paper sx={{ p: 2 }}>

      <Box
        sx={{
          width: "100%",
          aspectRatio: "16/9",
          backgroundColor: "#000",
          borderRadius: 2,
          overflow: "hidden"
        }}
      >

        <video
          key={lecture?.id}
          ref={videoRef}
          controls
          style={{
            width: "100%",
            height: "100%"
          }}
        />

      </Box>

      <Typography mt={2} fontWeight={600} variant="h6">
        {lecture?.name}
      </Typography>

    </Paper>
  );
}