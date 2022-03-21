import React, { useState, useRef, useEffect } from 'react';
import Client from '../../components/Client/Client';
import Editor from '../../components/Editor/Editor';
import toast from 'react-hot-toast';
import './EditorPage.scss';
import { initSocket } from '../../common/socket';
import ACTIONS from '../../common/Actions';
import {
	useLocation,
	useNavigate,
	useParams,
	Navigate
} from 'react-router-dom';

const EditorPage = () => {
	const socketRef = useRef(null);
	const codeRef = useRef(null);
	const location = useLocation();
	const reactNavigator = useNavigate();
	const { roomId } = useParams();
	const [clients, setClients] = useState([]);

	function leaveRoom() {
		reactNavigator('/');
	}
	useEffect(() => {
		const init = async () => {
			socketRef.current = await initSocket();
			socketRef.current.on('connect_error', (err) => handleErrors(err));
			socketRef.current.on('connect_failed', (err) => handleErrors(err));

			function handleErrors(e) {
				console.log('socket error', e);
				toast.error('Socket connection failed, try again later.');
				reactNavigator('/');
			}

			socketRef.current.emit(ACTIONS.JOIN, {
				roomId,
				username: location.state?.username
			});

			socketRef.current.on(
				ACTIONS.JOINED,
				({ clients, username, socketId }) => {
					if (username !== location.state?.username) {
						toast.success(`${username} joined the room.`);
						console.log(`${username} joined`);
					}
					setClients(clients);
					socketRef.current.emit(ACTIONS.SYNC_CODE, {
						code: codeRef.current,
						socketId
					});
				}
			);

			socketRef.current.on(
				ACTIONS.DISCONNECTED,
				({ socketId, username }) => {
					toast.success(`${username} left the room.`);
					setClients((prev) => {
						return prev.filter(
							(client) => client.socketId !== socketId
						);
					});
				}
			);
		};
		init();
		//clearing listeners for optimization
		return () => {
			socketRef.current.disconnect();
			socketRef.current.off(ACTIONS.JOINED);
			socketRef.current.off(ACTIONS.DISCONNECTED);
		};
	}, []);

	if (!location.state) {
		return <Navigate to="/" />;
	}

	const copyRoomId = async () => {
		try {
			await navigator.clipboard.writeText(roomId);
			toast.success('Room ID has been copied to your clipboard.');
		} catch (err) {
			toast.error('Could not copy Room ID.');
			console.error(err);
		}
	};
	return (
		<div className="mainWrap">
			<div className="aside">
				<div className="asideInner">
					<p className="logo">CODE-SYNC</p>
					<p className="connected">Connected</p>
					<div className="clientsList">
						{clients.map((client) => (
							<Client
								key={client.socketId}
								username={client.username}
							/>
						))}
					</div>
				</div>
				<div className="buttons">
					<button className="btn copyBtn" onClick={copyRoomId}>
						Copy ROOM ID
					</button>
					<button className="btn leave" onClick={leaveRoom}>
						Leave
					</button>
				</div>
			</div>
			<div className="editorWrap">
				<Editor
					socketRef={socketRef}
					roomId={roomId}
					onCodeChange={(code) => {
						codeRef.current = code;
					}}
				/>
			</div>
		</div>
	);
};

export default EditorPage;
