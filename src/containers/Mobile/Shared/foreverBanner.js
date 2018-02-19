import React from 'react';
import { Notification } from '@/components/mobile';
const foreverBanner = (params) => {
	const inlineStyle = {
		color: params.text_color
	};
	
	const disableCloseFilter = (params.close_button.fg_show === '0');
	
	let content = <div>Loading...</div>;
	if (params.text.text1 && params.text.text2 !== '') {
		content = (
			<div>
				<div style={inlineStyle}>{params.text.text1}</div>
				<p style={inlineStyle}>{params.text.text2}</p>
			</div>
		);
	}
	return (
		<Notification
			color={params.text.background_color}
			show={params.show}
			onClose={params.onClose}
			disableClose={disableCloseFilter}
		>
			{content}
		</Notification>
	);
};

export default foreverBanner;
