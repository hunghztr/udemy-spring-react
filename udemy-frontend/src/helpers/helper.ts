export function sliceFile(file: File, start: number, end: number) {
  return file.slice(start, end);
}

// hour (float) -> mm:ss
const secondsToMinute = (seconds: number) => {
  return Number((seconds / 60).toFixed(2)); // phút dạng float
};

export const minuteToMMSS = (second: number) => {
  const minute = secondsToMinute(second);
  const totalSeconds = Math.round(minute * 60);
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;

  return `${mm.toString().padStart(2, "0")}:${ss
    .toString()
    .padStart(2, "0")}`;
};