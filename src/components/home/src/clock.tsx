import { useEffect, useState } from "react";

export default function clock() {
  const [time, setTime] = useState<string | undefined>(undefined); // Ensure the state can hold a string

  useEffect(() => {
    setInterval(() => {
      const dateObject = new Date();

      const hour = String(dateObject.getHours()).padStart(2, "0");
      const minute = String(dateObject.getMinutes()).padStart(2, "0");
      const second = String(dateObject.getSeconds()).padStart(2, "0");

      const currentTime = hour + " : " + minute + " : " + second;

      setTime(currentTime); // currentTime should be a string
    }, 1000);
  }, []);

  return <div>{time}</div>;
}
