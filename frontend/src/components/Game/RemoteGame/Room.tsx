import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { room } = useParams();
  const [chatLog, setChatLog] = useState('');
  const [message, setMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const chatSocket = new WebSocket(
      `ws://${window.location.host.split(':')[0]}:8000/ws/chat/${room}/`
    );
    console.log(
      `ws://${window.location.host.split(':')[0]}:8000/ws/chat/${room}`
    );
    socketRef.current = chatSocket;

    inputRef.current?.focus();

    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setChatLog((v) => v + `${data.message}\n`);
    };

    // Listen for the connection to open
    chatSocket.onopen = () => {
      console.log('WebSocket connection established');
      // Now that the connection is open, you can safely send data
      //   chatSocket.send(JSON.stringify({ message: 'Hello, server!' }));
    };

    chatSocket.onclose = function (e) {
      console.error('Chat socket closed unexpectedly');
    };

    return () => {};
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // socketRef.current?.send(
    //   JSON.stringify({
    //     message: message,
    //   })
    // );
    // setMessage('');
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      // Send message only if the WebSocket connection is open
      socketRef.current.send(JSON.stringify({ message }));
      setMessage('');
    } else {
      console.error('WebSocket is not open yet.');
    }
  };

  return (
    <div>
      <textarea
        readOnly={true}
        value={chatLog}
        id="chat-log"
        cols={100}
        rows={20}
      ></textarea>
      <br />
      <form onSubmit={(e) => handleSubmit(e)} action="">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
          type="text"
          size={100}
        />
        <br />
        <button onClick={handleSubmit} type="button" value="Send">
          Send
        </button>
        {room}
      </form>
    </div>
  );
};

export default Room;
