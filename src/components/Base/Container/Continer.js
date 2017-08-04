import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Container.scss';

const cx = classNames.bind(styles);

const Container = (props) => {
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

export default Container;

Container.propTypes = {
	fluid: PropTypes.bool,
	flex: PropTypes.bool,
	children: PropTypes.node
};