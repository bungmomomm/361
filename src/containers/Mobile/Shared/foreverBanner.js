import React from 'react';
import { Notification } from '@/components/mobile';
import { Link } from 'react-router-dom';
const foreverBanner = (params) => {
	const inlineStyle = {
		color: params.textColor
	};
	const paramLinkValue = params.linkValue || '';
	return (
		<Link to={paramLinkValue}>
			<Notification color={params.backgroundColor} show={params.show} onClose={params.onClose}>
				<div style={inlineStyle}>{params.text1}</div>
				<p style={inlineStyle}>{params.text2}</p>
			</Notification>
		</Link>
	);
};

export default foreverBanner;
