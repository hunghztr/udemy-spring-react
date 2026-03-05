export function sliceFile(file: File, start: number, end: number) {
  return file.slice(start, end);
}

// chuyển đổi giây sang phút (dạng float)
const secondsToMinute = (seconds: number) => {
  return Number((seconds / 60).toFixed(2)); // phút dạng float
};
// chuyển sang định dạng mm:ss
export const minuteToMMSS = (second: number) => {
  const minute = secondsToMinute(second);
  const totalSeconds = Math.round(minute * 60);
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;

  return `${mm.toString().padStart(2, "0")}:${ss
    .toString()
    .padStart(2, "0")}`;
};

export function formatToVNTime(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}