import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const fromNow = (date: string) => {
  return dayjs(date).fromNow();
};

export const formatDateTime = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};
