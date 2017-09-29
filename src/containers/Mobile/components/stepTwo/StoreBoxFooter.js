import React from 'react';
import s from './StoreBoxFooter.scss';
import { 
	Checkbox,
	Tooltip,
	Level
} from '@/components';
import { currency } from '@/utils';


const StoreBoxFooter = ({ data, selectedAddress, stepOneActiveTab, checkGosendMethod }) => {
	const store = data.store;
	const isGosendSupported = () => {
		return (
			store.shipping.gosend.gosendSupported
			&& store.shipping.gosend.gosendApplicable
			&& stepOneActiveTab === 0
		);
	};

	const hasLangLat = () => {
		return (
			selectedAddress.attributes.latitude
			&& selectedAddress.attributes.longitude
		);
	};
	
	return (
		<div className={s.footer}>
			{
				(!isGosendSupported() && !store.isJabodetabekArea) && (
					<div className={s.deliveryInfo}>{store.shipping.note}</div>
				)
			}
			{
				isGosendSupported() && (
					<div className={s.deliveryInfo}>
						<Level noMargin>
							<Level.Item>
								<Checkbox 
									disabled={!hasLangLat()}
									name='gojek' 
									content='Pengiriman:'
									sprites='gosend'
									defaultChecked={store.shipping.gosend.gosendActivated}
									onClick={() => checkGosendMethod(!store.shipping.gosend.gosendActivated, store)}
								/>
							</Level.Item>
							<Level.Item>
								{
									store.gosendInfo && (
										<Tooltip position='right' content='Info' color='white'>
											{store.gosendInfo.length > 1 ? store.gosendInfo[1] : store.gosendInfo}
										</Tooltip>
									)
								}
							</Level.Item>
						</Level>
						{
							!hasLangLat() && (
								<a role='link' tabIndex='0' className='font-orange'>Mohon pilih titik lokasi pengiriman anda</a>
							)
						}
					</div>
				)
			}
			<div className={s.price}>
				<div className={s.priceList}>
					<div>Biaya Pengiriman</div>
					<div>{currency(store.price.final_delivery_cost)}</div>
				</div>
				<div className={s.priceListBold}>
					<div>Total</div>
					<div>{currency(store.price.total)}</div>
				</div>
			</div>
		</div>
	);
};

export default StoreBoxFooter;