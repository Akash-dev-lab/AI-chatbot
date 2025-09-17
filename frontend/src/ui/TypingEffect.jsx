import { useState, useEffect } from "react";

const TypingEffect = ({ text, speed = 25 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <div className="whitespace-pre-line">{displayedText}</div>;
};

export default TypingEffect;
