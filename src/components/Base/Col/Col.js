import React from 'react';
import classNames from 'classnames/bind';
import styles from './Col.scss';

const cx = classNames.bind(styles);

export default (props) => {
	const colClass = cx({
		col: true,
		[`col-${props.grid}`]: !!props.grid,
		[`text-${props.text}`]: !!props.text,
		row: !!props.row,
	});
	return (
		<div className={colClass}>
			{props.children}
		</div>
	);
};