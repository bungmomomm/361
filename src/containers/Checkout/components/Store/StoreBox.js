import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/Icon';
import styles from './StoreBox.scss';

const StoreBox = (props) => {
	return (
		<div className={styles.box} >
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