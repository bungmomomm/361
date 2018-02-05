/**
 * Created by mmdc on 2/5/18.
 */
import React from 'react';
import { Notification } from '@/components/mobile';
const foreverBanner = (params) => {
	const inlineStyle = {
		color: params.textColor
	};
	return (
		<Notification color={params.backgroundColor} show={params.show} onClose={params.onClose}>
			<div style={inlineStyle}>{params.text1}</div>
			<p style={inlineStyle}>{params.text2}</p>
		</Notification>
	);
};

export default foreverBanner;
