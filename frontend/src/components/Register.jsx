import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BorderBeam } from "@/components/magicui/border-beam";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://ai-chatbot-1-qxr6.onrender.com/api/auth/register",
        {
          fullName: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="register-container">
      <div className="relative">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p>Let's get started with your free account</p>

          <div className="flex gap-4">
            <div className="input-group flex-1">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>
            <div className="input-group flex-1">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

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

          <button type="submit">Create account</button>

          <div className="form-footer">
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </form>

        <BorderBeam duration={8} size={100} />
      </div>
    </div>
  );
};

export default Register;
