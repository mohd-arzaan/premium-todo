import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { register, reset } from '../features/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { name, email, password } = formData;
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Component unmount hone par reset
    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    // Register call karo
    dispatch(register({ name, email, password }))
      .unwrap() // Promise resolve hone ka wait karo
      .then(() => {
        toast.success('Account created successfully! Please login.');
        dispatch(reset()); // Purani state clear karo
        navigate('/login'); // Seedha login page pe bhejo
      })
      .catch((err) => {
        toast.error(err); // Agar error aaye toh show karo
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm p-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/70 dark:border-gray-700 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-colors duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">Sign up to get started</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input type="text" name="name" value={name} onChange={onChange}
              className="w-full py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border border-white/60 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Full Name" required />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input type="email" name="email" value={email} onChange={onChange}
              className="w-full py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border border-white/60 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Email address" required />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input type="password" name="password" value={password} onChange={onChange}
              className="w-full py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border border-white/60 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Password" required />
          </div>

          <button type="submit" disabled={isLoading}
            className="flex items-center justify-center w-full py-3 mt-4 text-white bg-orange-500 rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all font-semibold disabled:opacity-50">
            {isLoading ? 'Loading...' : <><UserPlus className="w-5 h-5 mr-2" /> Register</>}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6 font-medium">
          Already have an account? <Link to="/login" className="text-orange-500 font-bold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;