import React from 'react';
import Avatar from 'react-avatar';


const Client = ({ username }) => {
	return (
		<div
			style={{
				marginTop: '10px',
				marginRight: '20px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center'
			}}>
			<Avatar name={username} size={50} round="14px" />
			<span style={{ fontSize: '15px' }}>{username}</span>
		</div>
	);
};

export default Client;
