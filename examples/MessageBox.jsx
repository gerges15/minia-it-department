const Button = ({ text, onClick }) => {
  /* ... */
};

const MessageBox = ({ open, text, buttons }) =>
  open ? (
    <div>
      {text}
      {buttons(Button)}
    </div>
  ) : null;

export default MessageBox;
