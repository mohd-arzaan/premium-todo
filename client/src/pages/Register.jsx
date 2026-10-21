import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Register Data:', formData);
    // Aage yahan Redux API call aayegi
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">Sign up to start managing tasks</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full py-2 pl-10 pr-4 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full py-2 pl-10 pr-4 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full py-2 pl-10 pr-4 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center justify-center w-full py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;