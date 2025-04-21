import React, { useEffect, useState } from 'react';
import * as SignalR from '@microsoft/signalr';

const NotificationComponentLk = () => {
  const URL = 'http://graduationprojecthost.runasp.net';
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newConnection = SignalR.HubConnectionBuilder()
      .withUrl(URL, {})
      .witAutomaticReconnect.build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection
            .invoke('GetConnectionId')
            .then(id => console.log('Connection ID: ', id));

          console.log('connected');

          connection.on('ReceiveNotification', message => {
            console.log('Received notification: ', message);
            setNotifications(notifications => [...notifications, message]);
          });
        })
        .catch(e => console.log('connection failed ', e));
    }
  }, [connection]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponentLk;
