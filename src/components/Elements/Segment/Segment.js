import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './Segment.scss';
const cx = classNames.bind(styles);

const Segment = (props) => {
	const SegmentClass = cx({
		segment: true,
		[`${props.align}`]: !!props.align,
		[`${props.className}`]: !!props.className,
	});
	
	return (
		<div className={SegmentClass}>
			{props.children}
		</div>
	);
};

Segment.propTypes = {
	/** Formats content to be aligned. */
	align: PropTypes.oneOf(['left', 'center', 'right']),
	
	/** Passed className from parent. */
	className: PropTypes.string
};

export default Segment;