import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Modal.scss';
const cx = classNames.bind(styles);

const Body = (props) => {
	const BodyClass = cx({
		body: true
	});
	return (
		<div className={BodyClass}>
			{props.children}
		</div>
	);
};

export default Body;