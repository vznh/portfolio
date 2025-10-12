// components/Crypted.tsx
import React from 'react';

interface CryptedProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const Crypted: React.FC<CryptedProps> = ({ text, delay = 15, className = '', onComplete }) => {
  const [displayText, setDisplayText] = React.useState<string>('');
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const isCompleteRef = React.useRef<boolean>(false);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  React.useEffect(() => {
    if (isCompleteRef.current) {
      setDisplayText(text);
      return;
    }

    if (currentIndex >= text.length) {
      isCompleteRef.current = true;
      setDisplayText(text);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      onComplete?.();
      return;
    }

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => {
        const revealedText = text.slice(0, currentIndex);
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        return revealedText + randomChar;
      });
    }, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, text, delay, onComplete]);

  React.useEffect(() => {
    if (isCompleteRef.current) return;

    const revealInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(revealInterval);
      }
    }, delay * 8); // Reveal next character every 8 cycles

    return () => clearInterval(revealInterval);
  }, [text, delay]);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
};

export default Crypted;
