import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Modal.scss';
const cx = classNames.bind(styles);

const Header = (props) => {
	const ItemClass = cx({
		Header: true
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