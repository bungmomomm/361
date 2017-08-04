import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Col.scss';

const cx = classNames.bind(styles);

const Col = (props) => {
	const colClass = cx({
		col: true,
		[`col-${props.grid}`]: !!props.grid,
		[`text-${props.text}`]: !!props.text,
		row: !!props.row,
		[`${props.className}`]: !!props.className,
	});
	return (
		<div className={colClass}>
			{props.children}
		</div>
	);
};

export default Col;

Col.propTypes = {
	grid: PropTypes.number,
	text: PropTypes.string,
	row: PropTypes.bool,
	className: PropTypes.node,
	children: PropTypes.node
};