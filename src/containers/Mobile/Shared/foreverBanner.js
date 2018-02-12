import React from 'react';
import { Notification } from '@/components/mobile';
const foreverBanner = (params) => {
	const inlineStyle = {
		color: params.text_color
	};
	return (
		<Notification
			color={params.text.background_color}
			show={params.show}
			onClose={params.onClose}
			disableClose={params.close_button.fg_show}
		>
			<div style={inlineStyle}>{params.text.text1}</div>
			<p style={inlineStyle}>{params.text.text2}</p>
		</Notification>
	);
};

export default foreverBanner;
