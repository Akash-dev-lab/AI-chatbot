import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { useDispatch } from "react-redux";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import "./App.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/user/userSlice.js";

const App = () => {

	const theme = useSelector((state) => state.theme.theme);

	const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchCurrentUser()); 
//   }, [dispatch]);
	

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
