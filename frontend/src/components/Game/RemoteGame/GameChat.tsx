import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';

const GameChat = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  //   const submitRef = useRef<HTMLInputElement | null>(null);
  const [submited, setSubmited] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    inputRef.current?.focus();

    return () => {};
  }, []);

  if (submited) return <Navigate to={`/game/chat/${value}`} />;

  return (
    <form onSubmit={() => setSubmited(true)}>
      What chat room would you like to enter?
      <br />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
        type="text"
        size={100}
      />
      <br />
      <button
        id="room-name-submit"
        type="button"
        value="Enter"
        onClick={() => setSubmited(true)}
      >
        Submit
      </button>
    </form>
  );
};

export default GameChat;
