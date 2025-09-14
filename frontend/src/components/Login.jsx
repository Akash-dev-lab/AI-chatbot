import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import "../styles/Login.css";
import { BorderBeam } from "@/components/magicui/border-beam"; 
import { updateUser, setUser } from "../features/user/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

       console.log("Login Response:", res);

      dispatch(setUser(res.data.user));
      // dispatch(updateUser(res.data.user));
      window.location.href = "/";
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
    }
  }

  return (
    <div className="register-container">
      <div className="relative">
        <form className="register-form p-10" onSubmit={handleSubmit}>
          <h2>Welcome Back!</h2>
          <p>Login into your Credentials.</p>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit">Log in</button>

          <div className="form-footer">
            <p>
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </div>
        </form>

        {/* BorderBeam applied on form border */}
        <BorderBeam duration={8} size={100} />
      </div>
    </div>
  );
};

export default Login;
