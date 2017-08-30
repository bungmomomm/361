import React from 'react';
import PropTypes from 'prop-types';
import styles from './CheckoutResult.scss';
import { Checkbox } from '@/components';

import { currency } from '@/utils';

const CheckoutResult = (props) => {
	const selectedAddress = props.selectedAddress;
	const latLng = !selectedAddress ? false : selectedAddress.attributes.latitude && selectedAddress.attributes.longitude && selectedAddress.attributes.latitude !== '' && selectedAddress.attributes.longitude !== '';
	return (
		<div className={styles.footer}>
			{
				props.shipping.gosend.gosendSupported && props.shipping.gosend.gosendApplicable && props.addressTabActive ? 
					<div className={styles.deliveryInfo}>
						<Checkbox name='gojek' content='Pengiriman:' checked={props.shipping.gosend.gosendActivated} value={props.store} onClick={props.checkGosendMethod} sprites='gosend' /> 
					</div>
					:
					(
						props.shipping.gosend.gosendSupported && !latLng && props.addressTabActive ? 
							<div className={styles.deliveryInfo}>
								<Checkbox name='gojek' content='Pengiriman:' disabled checked={false} sprites='gosend' />
								<div className='font-orange'>Mohon pilih titik lokasi pengiriman anda</div>
							</div>
						:
						!props.shipping.note ? null : <div className={styles.deliveryInfo}>{props.shipping.note}</div>
					)
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