import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
	const navigate = useNavigate();
	const [roomId, setRoomId] = useState('');
	const [username, setUsername] = useState('');
	const createNewRoomId = (e) => {
		e.preventDefault();
		setRoomId(uuidV4());
		toast.success('Created a new room');
	};
	const joinRoom = () => {
		if (!roomId || !username) {
			toast.error('Room Id & Username is required.');
			return;
		}
		navigate(`/editor/${roomId}`, {
			state: {
				username
			}
		});
	};
	const handleInputEnter = (e) => {
		if (e.code === 'Enter') {
			joinRoom();
		}
	};
	return (
		<div className="homePageWrapper">
			<div className="formWrapper">
				<p className="logo">CODE-SYNC </p>
				<p className="mainLabel">Paste invitaion ROOM ID</p>
				<div className="inputGroup">
					<input
						type="text"
						className="inputBox"
						placeholder="ROOM ID"
						value={roomId}
						onKeyUp={handleInputEnter}
						onChange={(e) => setRoomId(e.target.value)}
					/>
					<input
						type="text"
						className="inputBox"
						placeholder="USERNAME"
						value={username}
						onKeyUp={handleInputEnter}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<button className="btn joinBtn" onClick={joinRoom}>
						Join
					</button>
					<span className="createInfo">
						If you don't have an invite then create &nbsp;
						<Link
							to="/"
							className="createNewBtn"
							onClick={createNewRoomId}>
							new room
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export default Home;
