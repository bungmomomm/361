import React from 'react';
import classNames from 'classnames/bind';
import { isMobile } from '@/utils';
import styles from './ModalFooter.scss';
const cx = classNames.bind(styles);

const Footer = (props) => {
	const FooterClass = cx({
		Footer: true,
		[`${props.className}`]: !!props.className,
		mobile: isMobile()
	});
	return (
		<div className={FooterClass}>
			{props.children}
		</div>
	);
};

export default Footer;