import React from 'react';
import s from './StoreBoxFooter.scss';
import { Sprites } from '@/components';
import { 
	Checkbox,
	Tooltip,
	Level
} from 'mm-ui';
import { T } from '@/data/translations';
import { currency } from '@/utils';


const StoreBoxFooter = ({ data, selectedAddress, stepOneActiveTab, checkGosendMethod, showEditAddressModal, isRestrictO2O, isJabotabekItem }) => {
	const store = data.store;
	const isGosendSupported = () => {
		return (
			store.shipping.gosend.gosendSupported
			// && store.shipping.gosend.gosendApplicable
			&& stepOneActiveTab === 0
		);
	};

	const hasLangLat = () => {
		return (
			selectedAddress.attributes.latitude !== ''
			&& selectedAddress.attributes.longitude !== ''
		);
	};
	
	return (
		<div className={s.footer}>
			{!isGosendSupported() && <div className={s.deliveryInfo}>{store.shipping.note}</div>}
			{
				isGosendSupported() && (!isRestrictO2O && !isJabotabekItem) && (
					<div className={s.deliveryInfo}>
						<Level>
							<Level.Item>
								{
									store.shipping.gosend.gosendApplicable && (
										<Checkbox 
											disabled={!hasLangLat()}
											name='gojek'
											defaultChecked={store.shipping.gosend.gosendActivated}
											onClick={() => checkGosendMethod(!store.shipping.gosend.gosendActivated, store)}
										>
											Pengiriman: <Sprites name='gosend' />
										</Checkbox>
									)
								}
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
								<div>
									<Checkbox state={!hasLangLat() ? 'disabled' : ''} name='gojek' defaultChecked={false} >
										Pengiriman: <Sprites name='gosend' />
									</Checkbox>
									<div role='button' onClick={() => showEditAddressModal('edit')} tabIndex='0' className='font-orange'>{T.checkout.CHOOSE_SHIPPING_LOCATION}</div>
								</div>
							)
						}
					</div>
				)
			}
			<div className={s.price}>
				<div className={s.priceList}>
					<div>{T.checkout.SHIPPING_COST}</div>
					<div>{currency(store.price.final_delivery_cost)}</div>
				</div>
				<div className={s.priceListBold}>
					<div><strong>{T.checkout.TOTAL}</strong></div>
					<div><strong>{currency(store.price.total)}</strong></div>
				</div>
			</div>
		</div>
	);
};

export default StoreBoxFooter;