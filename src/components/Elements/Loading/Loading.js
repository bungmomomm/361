import React from 'react';
import styles from './Loading.scss';
import { Image } from '@/components';

export default (props) => {
	return (
		<div className={styles.Loading}>
			<Image src='momo-loading.gif' height={90} alt='momo loading' />
		</div>
	);
};