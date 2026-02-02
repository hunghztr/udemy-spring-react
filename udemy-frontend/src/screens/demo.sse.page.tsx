import { useEffect, useState } from "react";

export default function Demo() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const sse = new EventSource(
      "http://localhost:8080/api/v1/sse/subscribe"
    );

    sse.addEventListener("notify", (event) => {
      setNotifications((prev) => [...prev, event.data]);
    });

    sse.onerror = () => {
      console.log("SSE error");
      sse.close();
    };

    return () => sse.close();
  }, []);

  const callHelloApi = async () => {
    const res = await fetch("http://localhost:8080/api/v1/hello");
    const text = await res.text();
    console.log(text);
  };

  return (
    <div>
      <button onClick={callHelloApi}>Call /hello</button>

      <h3>📢 Notification</h3>
      <ul>
        {notifications.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
