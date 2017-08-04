import React from 'react';
import PropTypes from 'prop-types';
import styles from './InputGroup.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const InputGroup = (props) => {
	const inputGroupClass = cx({
		InputGroup: true,
		addons: !!props.addons,
	});
	return (
		<div className={inputGroupClass}>
			{props.children}
		</div>
	);
};

export default InputGroup;

InputGroup.propTypes = {
	addons: PropTypes.bool,
	children: PropTypes.node
};