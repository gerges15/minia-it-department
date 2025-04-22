import { useState } from 'react';
import MessageBox from '../src/components/MessageBox';

export default function MyComponent() {
  const { state, setState } = useState(null);
  function onDeleteButtonClick(data) {}

  function onMessageOkClick() {}

  return (
    <>
      // ...content...
      <button onClick={onDeleteButtonClick}>delete</button>
      // more content
      <MessageBox
        open={true}
        text="Question?"
        buttons={Button => [
          <Button text="Ok" onClick={onMessageOkClick} />,
          <Button text="Cancel" onClick={() => console.log('hello')} />,
        ]}
      />
    </>
  );
}
