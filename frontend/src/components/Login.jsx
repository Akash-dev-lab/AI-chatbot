import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; 

const Login = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:3000/api/auth/login", {
        email: formData.email,
        password: formData.password
    },
    { withCredentials: true })
    .then((res) => {
        console.log(res)
        navigate("/")
    }).catch((err) => {
        console.error(err)
    });
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <p>Please log in to your account</p>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit">Log in</button>
        <div className="form-footer">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
