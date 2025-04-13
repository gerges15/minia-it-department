import { Link } from 'react-router';
export default function SingUpLink() {
  return (
    <p className="text-gray-500 mb-8">
      Don't have an account?{' '}
      <Link to="/signup" className="text-[#7e57c2] hover:underline">
        Sign up
      </Link>
    </p>
  );
}
