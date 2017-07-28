import React from 'react';
import classNames from 'classnames/bind';
import styles from './Box.scss';
const cx = classNames.bind(styles);

export default (props) => {
	const accordionClass = cx({
		accordion: true
	});
	return (
		<div className={accordionClass}>
			{props.children}
		</div>
	);
};