import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post('http://localhost:5001/api/users/login', { email, password });


      localStorage.setItem('token', response.data.token);


      navigate('/');
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
  <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
    <h1 className="text-4xl font-extrabold text-center text-[#1C8316] mb-2">
      MindCompass
    </h1>


    {error && (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 rounded-lg text-sm">
        {error}
      </div>
    )}

    <form onSubmit={handleLogin}>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C8316] focus:border-[#1C8316] transition"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C8316] focus:border-[#1C8316] transition"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#1C8316] text-white text-lg font-semibold rounded-lg hover:bg-[#136310] focus:outline-none focus:ring-4 focus:ring-[#1C8316] focus:ring-opacity-50 transition"
      >
        Login
      </button>
    </form>

    <div className="mt-8 text-center">
      <p className="text-sm text-gray-600">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-medium text-[#1C8316] hover:text-[#136310] transition"
        >
          Register here
        </a>
      </p>
    </div>
  </div>
</div>
 );
};

export default Login;
