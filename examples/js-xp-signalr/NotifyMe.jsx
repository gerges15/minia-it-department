import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { aToken } from '../auth-xp';

export default function NotifyMe() {
  const URL = 'http://graduationprojecthost.runasp.net/TimeTableHub';
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);

  console.log(aToken);
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(URL, {
        withCredentials: true,
        // accessTokenFactory: () =>
        //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwMTk2MTMxQkNCRjI3NEFBQTlCNTQ5MzgxMENCRDZFRSIsImdpdmVuX25hbWUiOiJhZG1pbiBhZG1pbiIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc0NDY2MTQ3MiwiZXhwIjoxNzQ0NjYyNjcyLCJpYXQiOjE3NDQ2NjE0NzIsImlzcyI6IkdyYWR1YXRpb24gVGVhbSIsImF1ZCI6IklUIERlcGFydG1lbnQifQ.spu3V0cYt9CWyb1Vq6XSQglQbBe9WGFABQxKHS56nHY',
      })
      .build();

    connection.start();

    connection.on('NotifyMe', data => {
      setMessage(data);
    });
  }, []);
  return <div className="font-extrabold">the message here: {message}</div>;
}
