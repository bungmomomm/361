import React from 'react';
import PropTypes from 'prop-types';
import styles from './Icon.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Icon = (props) => {
	const classIcon = cx({
		icon: true,
		[`custom_${props.custom}`]: !!props.custom,
	});
	return (
		<i className={`${classIcon} ${props.name ? `icon-${props.name}` : '' `${props.className}` ? `${props.className}` : ''}`} />
	);
};

export default Icon;

Icon.propTypes = {
	custom: PropTypes.string,
	name: PropTypes.string,
	className: PropTypes.string
};

