import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Notification } from '@/components/mobile';
import { actions as sharedActions } from '@/state/v4/Shared';

const onClose = (dispatch) => {
	dispatch(sharedActions.closeFB());
};

const foreverBanner = (params) => {
	const { close_button, text, show, dispatch, link } = params;
	const isHide = _.isEmpty(text.text1) && _.isEmpty(text.text2);

	if (isHide) {
		return null;
	}

	const inlineStyle = {
		color: text.text_color
	};

	const disableCloseFilter = (close_button.fg_show === '0');

	let content = <div>Loading...</div>;
	if (!isHide) {
		content = (
			link.type === 'url_web' ? 
				(<a href={link.target}>
					<div className='margin--medium-v'>
						<div className='font-large' style={inlineStyle}>{text.text1}</div>
						<p style={inlineStyle}>{text.text2}</p>
					</div>
				</a>)
			:
			(<Link to={link.target}>
				<div className='margin--medium-v'>
					<div className='font-large' style={inlineStyle}>{text.text1}</div>
					<p style={inlineStyle}>{text.text2}</p>
				</div>
			</Link>)
		);
	}
	
	
	const notificationAttributeStyle = {
		backgroundColor: text.background_color
	};
	
	return (
		<Notification
			show={show}
			onClose={() => onClose(dispatch)}
			disableClose={disableCloseFilter}
			style={notificationAttributeStyle}
		>
			{content}
		</Notification>
	);
};

export default foreverBanner;
