import React from 'react';
import Icon from '@/components/Icon';
import styles from './StoreBox.scss';

export default (props) => {
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