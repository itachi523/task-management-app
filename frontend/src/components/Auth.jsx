import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`https://task-management-backend-0ysg.onrender.com${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="glass-panel auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="auth-title">TaskMaster</h1>
        <p className="auth-subtitle">{isLogin ? 'Welcome back! Please login.' : 'Create an account to get started.'}</p>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} size={20} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter username"
                required
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} size={20} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="switch-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create one' : 'Login instead'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
