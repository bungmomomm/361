import React from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '@/components/mobile';
import { actions as sharedActions } from '@/state/v4/Shared';

const onClose = (dispatch) => {
	dispatch(sharedActions.closeFB());
};

const foreverBanner = (params) => {
	const { close_button, text, show, dispatch, link } = params;

	const inlineStyle = {
		color: params.text_color
	};

	const disableCloseFilter = (close_button.fg_show === '0');

	let content = <div>Loading...</div>;
	if (text.text1 && text.text2 !== '') {
		content = (
			<div className='margin--medium-v'>
				<Link to={link.target}>
					<div className='font-large' style={inlineStyle}>{text.text1}</div>
					<p style={inlineStyle}>{text.text2}</p>
				</Link>
			</div>
		);
	}
	return (
		<Notification
			color='yellow'
			show={show}
			onClose={() => onClose(dispatch)}
			disableClose={disableCloseFilter}
		>
			{content}
		</Notification>
	);
};

export default foreverBanner;
