import { useAppDispatch } from "@/redux/hook";
import { addNotification } from "@/redux/slices/notification.slice";
import { logOut, refreshToken } from "@/redux/thunks/auth.thunk";
import type { INotificationResponse } from "@/type/notification.module";
import { useCallback, useEffect, useRef, useState } from "react";

export const useConnectSse = (enable: boolean) => {
  const [notification, setNotification] =
    useState<INotificationResponse | null>(null);

  const sseRef = useRef<EventSource | null>(null);
  const reconnectingRef = useRef(false);

  const dispatch = useAppDispatch();

  const connectSse = useCallback(() => {
    if (sseRef.current) return;

    const sse = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/sse/subscribe`,
      { withCredentials: true }
    );

    sseRef.current = sse;

    sse.addEventListener("notify", (event) => {
      const notify: INotificationResponse = JSON.parse(event.data);
      setNotification(notify);
      dispatch(addNotification(notify));
    });

    sse.onerror = async () => {
      if (reconnectingRef.current) return;

      reconnectingRef.current = true;
      sse.close();
      sseRef.current = null;

      try {
        dispatch(refreshToken())

        connectSse();
      } catch (error) {
        dispatch(logOut());
      } finally {
        reconnectingRef.current = false;
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (!enable) return;

    connectSse();

    return () => {
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, [enable, connectSse]);

  return { notification };
};
