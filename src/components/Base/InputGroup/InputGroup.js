import React from 'react';
import styles from './InputGroup.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default (props) => {
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