export default function LoginLeftSide() {
  return (
    <div className="w-1/2 relative overflow-hidden hidden lg:block">
      <img
        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
        alt="Student using laptop for online learning"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* bg black overlay on the image */}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
}
