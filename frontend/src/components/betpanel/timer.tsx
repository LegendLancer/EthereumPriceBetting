import React from 'react';
import { useTimer } from 'react-timer-hook';

interface TimerProps {
  expiryTimestamp: Date;
  handleFinish: CallableFunction;
}

const Timer = ({ expiryTimestamp, handleFinish }: TimerProps) => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: expiryTimestamp,
    onExpire: () => {
      handleFinish();
    },
    autoStart: true,
  });

  return (
    <div style={{ fontSize: '20px', color: 'white' }}>
      <span>{`${days} D`}</span> : <span>{`${hours} H`}</span> :{' '}
      <span>{`${minutes} M`}</span> : <span>{`${seconds} S`}</span>
    </div>
  );
};

export default Timer;
