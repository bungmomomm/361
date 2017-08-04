import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Row.scss';

const cx = classNames.bind(styles);

const Row = (props) => {
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

export default Row;

Row.propTypes = {
	gapless: PropTypes.bool,
	centered: PropTypes.bool,
	children: PropTypes.node
};