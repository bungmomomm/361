import React from 'react';
import classNames from 'classnames/bind';
import styles from './Tabs.scss';
const cx = classNames.bind(styles);

export default (props) => {
	const panelClass = cx({
		panel: true
	});
	return (
		<div className={panelClass}>
			{props.children}
		</div>
	);
};