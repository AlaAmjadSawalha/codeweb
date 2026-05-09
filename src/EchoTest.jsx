import { useEffect } from "react";
import echo from "./echo";

export default function EchoTest() {
   useEffect(() => {
    console.log("🚀 START");

    const channel = echo.channel("ai.1");

    console.log("📡 JOINED CHANNEL");

    channel.listen(".ai.status.updated", (data) => {
        console.log("🔥 LIVE EVENT:", data);
    });

    return () => {
        echo.leaveChannel("ai.1");
    };
}, []);
    return <h2>Echo Test Running...</h2>;
}