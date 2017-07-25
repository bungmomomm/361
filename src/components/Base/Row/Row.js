import React from 'react';
import classNames from 'classnames/bind';
import styles from './Row.scss';

const cx = classNames.bind(styles);

export default (props) => {
	const rowClass = cx({
		row: true,
		gapless: !!props.gapless,
		centered: !!props.centered
	});
	return (
		<div className={rowClass}>
			{props.children}
		</div>
	);
};