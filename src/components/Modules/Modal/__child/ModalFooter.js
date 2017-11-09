import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Modal.scss';
const cx = classNames.bind(styles);

const Footer = (props) => {
	const FooterClass = cx({
		Footer: true
	});
	return (
		<div className={FooterClass}>
			{props.children}
		</div>
	);
};

export default Footer;