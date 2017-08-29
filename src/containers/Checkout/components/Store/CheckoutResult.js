import React from 'react';
import PropTypes from 'prop-types';
import styles from './CheckoutResult.scss';
import { Checkbox, Sprites } from '@/components';

import { currency } from '@/utils';

const CheckoutResult = (props) => {
	return (
		<div className={styles.footer}>
			{
				props.shipping.gosend.gosendActivated && props.shipping.gosend.gosendSupported ? 
					<div className={styles.deliveryInfo}>
						<Checkbox name='gojek' content='Pengiriman:' /> &nbsp; <Sprites name='gosend' />
					</div>
					:
					<div className={styles.deliveryInfo}>{props.shipping.note}</div>
			}
			
			<div className={styles.price}>
				<div className={styles.priceList}>
					<div className={styles.label}>Biaya Pengiriman</div>
					<div className={styles.value}>{currency(props.price.final_delivery_cost)}</div>
				</div>
				<div className={styles.priceListBold}>
					<div className={styles.label}>Total</div>
					<div className={styles.value}>{currency(props.price.total)}</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutResult;

CheckoutResult.propTypes = {
	shipping: PropTypes.object,
	price: PropTypes.object
};