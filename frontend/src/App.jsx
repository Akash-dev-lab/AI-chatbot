import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import "./App.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const App = () => {

	const theme = useSelector((state) => state.theme.theme);
	

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return (
		<div className="app">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</div>
	);
}

export default App;
