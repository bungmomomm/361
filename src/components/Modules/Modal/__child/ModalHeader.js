import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { isMobile } from '@/utils';
import styles from './ModalHeader.scss';
const cx = classNames.bind(styles);

const Header = (props) => {
	const ItemClass = cx({
		Header: true,
		[`${props.className}`]: !!props.className,
		[`${props.variant}`]: !!props.variant,
		mobile: isMobile()
	});
	return (
		<div className={ItemClass}>
			{props.children}
		</div>
	);
};

export default Header;

Header.propTypes = {
	children: PropTypes.node
};