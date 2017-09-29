import React from 'react';
import { Icon } from '@/components';
import styles from './StoreBox.scss';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const StoreBox = (props) => {
	const BoxWrapper = cx({
		box: true,
		[`${props.color}`]: !!props.color,
		loading: !!props.loading
	});
	return (
		
		<div className={BoxWrapper} >
			<div className={styles.header}>
				<div className={styles.name}>{props.name}</div>
				<div className={styles.location}>
					{
						props.location && (
							<span>
								<Icon name='map-marker' /> {props.location}
							</span>
						)
					}
				</div>
			</div>
			{props.children}
		</div>
	);
};

export default StoreBox;