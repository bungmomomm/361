import React from 'react';
import classNames from 'classnames/bind';
import styles from './Container.scss';

const cx = classNames.bind(styles);

export default (props) => {
	const containerClass = cx({
		container: true,
		fluid: props.fluid,
		flex: props.flex
	});
	return (
		<div className={containerClass}>
			{props.children}
		</div>
	);
};