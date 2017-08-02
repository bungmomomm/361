import React from 'react';
import styles from './Icon.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default (props) => {
	const classIcon = cx({
		icon: true,
		[`custom_${props.custom}`]: !!props.custom,
	});
	return (
		<i className={`${classIcon} ${props.name ? `icon-${props.name}` : '' `${props.className}` ? `${props.className}` : ''}`} />
	);
};