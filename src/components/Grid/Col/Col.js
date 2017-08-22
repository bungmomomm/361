import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Col.scss';

const cx = classNames.bind(styles);

const Col = ({
	grid,
	className,
	children,
	flex
}) => {
	const colClass = cx({
		col: true,
		[`col-${grid}`]: !!grid,
		[`${className}`]: !!className,
		flex: !!flex
	});
	return (
		<div className={colClass}>
			{children}
		</div>
	);
};

export default Col;

Col.propTypes = {
	grid: PropTypes.number,
	className: PropTypes.string
};