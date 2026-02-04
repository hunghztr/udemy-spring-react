// components/notification/NotificationMenuIcon.tsx
import { useAppSelector } from "@/redux/hook";
import NotificationBadge from "./badge";

export default function NotifyIcon() {
  const { unRead } = useAppSelector((state) => state.notifications);

  return <NotificationBadge count={unRead} variant="dot" />;
}
