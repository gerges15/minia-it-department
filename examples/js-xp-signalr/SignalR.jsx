import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Cookies from 'js-cookie';
const SignalRComponent = () => {
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${url}/TimeTableHub`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log('Connected!');

        // Get the connectionId after successfully connecting
        newConnection
          .invoke('GetConnectionId')
          .then(id => {
            console.log('ConnectionId is:', id);
            setConnectionId(id);
          })
          .catch(err => console.error(err.toString()));

        // ... set up other SignalR event handlers here ...
      })
      .catch(err => console.log('Error establishing connection:', err));

    // Clean up the connection when the component is unmounted
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  return (
    <div>
      <p>Your ConnectionId: {connectionId}</p>
    </div>
  );
};

export default SignalRComponent;
