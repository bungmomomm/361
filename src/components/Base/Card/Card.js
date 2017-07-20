import React from 'react';
import classNames from 'classnames/bind';
import styles from './Card.scss';

const cx = classNames.bind(styles);

export default (props) => {
	const cardClass = cx({
		card: true,
	});
	return (
		<div className={cardClass}>
			{props.children}
		</div>
	);
};