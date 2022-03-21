import './styles.css';
import React from 'react';
import Home from './Pages/Home/Home';
import EditorPage from './Pages/EditorPage/EditorPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export default function App() {
	return (
		<>
			<div>
				<Toaster
					position="top-right"
					toastOptions={{
						success: {
							theme: {
								primary: '#4aed88'
							}
						}
					}}></Toaster>
			</div>
			<div className="App">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/editor/:roomId"
							element={<EditorPage />}
						/>
					</Routes>
				</BrowserRouter>
			</div>
		</>
	);
}
