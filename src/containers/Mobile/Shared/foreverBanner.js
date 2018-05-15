import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Notification } from '@/components/mobile';
import { actions as sharedActions } from '@/state/v4/Shared';

const onClose = (dispatch) => {
	dispatch(sharedActions.closeFB());
};

const foreverBanner = (params) => {
	const { close_button, text, show, dispatch, link, marginTop } = params;
	const isHide = _.isEmpty(text.text1) && _.isEmpty(text.text2);

	if (isHide) {
		return null;
	}

	const notificationInlineAttribute = {};

	// Add condition for inline styling
	if (marginTop) {
		notificationInlineAttribute.marginTop = marginTop;
	}

	const inlineStyle = {
		color: params.text_color
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
	return (
		<Notification
			color='yellow'
			show={show}
			onClose={() => onClose(dispatch)}
			disableClose={disableCloseFilter}
			style={notificationInlineAttribute}
		>
			{content}
		</Notification>
	);
};

export default foreverBanner;
