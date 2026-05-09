import { useEffect, useState } from "react";
import { pusher } from "../services/pusher"; // انتبهي للمسار

export default function AIStatus({ projectId }) {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!projectId) return;

    const channel = pusher.subscribe(`ai.${projectId}`);

    channel.bind("App\\Events\\AIStatusUpdated", (data) => {
      console.log("LIVE DATA:", data);
      setStatus(data.status);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`ai.${projectId}`);
    };
  }, [projectId]);

  return (
    <div>
      <h2>AI Status</h2>
      <p>{status}</p>
    </div>
  );
}