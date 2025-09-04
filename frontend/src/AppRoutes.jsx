import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import "./App.css";

const AppContent = () => {
	const { theme, toggleTheme } = useTheme();
	return (
		<div data-theme={theme}>
			<button onClick={toggleTheme} className="theme-toggle-button">
				Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
			</button>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</div>
	);
}

const AppRoutes = () => {
	return (
		<ThemeProvider>
			<Router>
				<AppContent />
			</Router>
		</ThemeProvider>
	);
};

export default AppRoutes;
