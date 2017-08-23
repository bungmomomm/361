import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@/components';
import styles from './StoreBox.scss';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const StoreBox = (props) => {
	const BoxWrapper = cx({
		box: true,
		[`${props.color}`]: !!props.color
	});
	return (
		<div className={BoxWrapper} >
			<div className={styles.header}>
				<div className={styles.name}>{props.name}</div>
				<div className={styles.location}><Icon name='map-marker' /> {props.location}</div>
			</div>
			{props.children}
		</div>
	);
};

export default StoreBox;

StoreBox.propTypes = {
	name: PropTypes.string,
	location: PropTypes.string,
	children: PropTypes.node
};