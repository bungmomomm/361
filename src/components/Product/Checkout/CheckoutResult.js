import React from 'react';
import styles from './CheckoutResult.scss';

import Sprites from '@/components/Sprites';

export default (props) => {
	return (
		<div className={styles.footer}>
			{
				props.gosend ? 
					<div className={styles.deliveryInfo}>Pengiriman: &nbsp; <Sprites name='gosend' /></div>
					:
					<div className={styles.deliveryInfo}>Pengiriman akan dilakukan 5-8 hari kerja</div>
			}
			
			<div className={styles.price}>
				<div className={styles.priceList}>
					<div className={styles.label}>Biaya Pengiriman</div>
					<div className={styles.value}>Rp 15.000</div>
				</div>
				<div className={styles.priceListBold}>
					<div className={styles.label}>Total</div>
					<div className={styles.value}>Rp 2.015.000</div>
				</div>
			</div>
		</div>
	);
};