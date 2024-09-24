import { useEffect, useState } from "react";

export default function clock() {
  const [time, setTime] = useState<string | undefined>(undefined); // Ensure the state can hold a string

  useEffect(() => {
    setInterval(() => {
      const dateObject = new Date();

      const hour = dateObject.getHours();
      const minute = dateObject.getMinutes();
      const second = dateObject.getSeconds();

      const currentTime = hour + " : " + minute + " : " + second;

      setTime(currentTime); // currentTime should be a string
    }, 1000);
  }, []);

  return <div>{time}</div>;
}
