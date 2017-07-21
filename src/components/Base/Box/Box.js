import React from 'react';
import classNames from 'classnames/bind';
import styles from './Box.scss';

const cx = classNames.bind(styles);

export default (props) => {
	const boxClass = cx({
		box: true,
	});
	return (
		<div className={boxClass}>
			{props.children}
		</div>
	);
};