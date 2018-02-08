import React from 'react';
import { Notification } from '@/components/mobile';
import { Link } from 'react-router-dom';
const foreverBanner = (params) => {
	const inlineStyle = {
		color: params.textColor
	};
	return (
		<Link to={(params.linkValue !== 'undefined') ? params.linkValue : ''}>
			<Notification color={params.backgroundColor} show={params.show} onClose={params.onClose}>
				<div style={inlineStyle}>{params.text1}</div>
				<p style={inlineStyle}>{params.text2}</p>
			</Notification>
		</Link>
	);
};

export default foreverBanner;
