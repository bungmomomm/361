import React from 'react';
import { Notification } from '@/components/mobile';
import { actions as sharedActions } from '@/state/v4/Shared';

const onClose = (dispatch) => {
	dispatch(sharedActions.closeFB());
};

const foreverBanner = (params) => {
	const inlineStyle = {
		color: params.text_color
	};
	
	const disableCloseFilter = (params.close_button.fg_show === '0');
	
	let content = <div>Loading...</div>;
	if (params.text.text1 && params.text.text2 !== '') {
		content = (
			<div className='margin--medium'>
				<div className='font-large' style={inlineStyle}>{params.text.text1}</div>
				<p style={inlineStyle}>{params.text.text2}</p>
			</div>
		);
	}
	return (
		<Notification
			color='yellow'
			show={params.show}
			onClose={() => onClose(params.dispatch)}
			disableClose={disableCloseFilter}
		>
			{content}
		</Notification>
	);
};

export default foreverBanner;
