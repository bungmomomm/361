import React from 'react';
import classNames from 'classnames/bind';
import { isMobile } from '@/utils';
import styles from './ModalBody.scss';
const cx = classNames.bind(styles);

const Body = (props) => {
	const BodyClass = cx({
		body: true,
		[`${props.className}`]: !!props.className,
		[`${props.variant}`]: !!props.variant,
		mobile: isMobile()
	});
	return (
		<div className={BodyClass}>
			{props.children}
		</div>
	);
};

export default Body;