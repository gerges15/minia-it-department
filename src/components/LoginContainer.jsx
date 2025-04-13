export default function LoginContainer(props) {
  return (
    <div className="flex h-screen flex-col justify-center items-center  w-screen bg-[#f5f5f0]">
      {props.children}
    </div>
  );
}
