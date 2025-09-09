import { useState } from 'react';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        axios.post("http://localhost:3000/api/auth/register", {
            fullName: {
                firstName: formData.firstName,
                lastName: formData.lastName
            },
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
                <h2>Create Your Account</h2>
                <p>Let's get started with your free account</p>
                <div className="name-group">
                    <div className="input-group">
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
                    <div className="input-group">
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
                    <p>Already have an account? <a href="/login">Log in</a></p>
                </div>
            </form>
        </div>
    );
};

export default Register;
