import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Modal.scss';
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

Footer.propTypes = {
	children: PropTypes.node
};