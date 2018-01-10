import React from 'react';
import s from './StoreBoxFooter.scss';
import {
	Sprites
} from '@/components';
import { 
	Checkbox,
	Icon,
	Tooltip
} from 'mm-ui';
import { T } from '@/data/translations';
import { currency } from '@/utils';


const StoreBoxFooter = ({ data, selectedAddress, stepOneActiveTab, checkGosendMethod, showEditAddressModal, isRestrictO2O, isJabotabekItem, shippingDefault, gosendInfo, onShowGosendTooltip }) => {
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
			{!isGosendSupported() && store.shipping.note && shippingDefault && <div className={s.deliveryInfo}>{store.shipping.note}</div>}
			{
				isGosendSupported() && shippingDefault && (!isRestrictO2O && !isJabotabekItem) && (
					<div className={s.deliveryInfo}>
						{
							store.shipping.gosend.gosendApplicable && hasLangLat() && (
								<div>
									<Checkbox 
										style={{ display: 'inline-block', verticalAlign: 'top' }}
										disabled={!hasLangLat()}
										name='gojek'
										checked={store.shipping.gosend.gosendActivated}
										onClick={() => checkGosendMethod(!store.shipping.gosend.gosendActivated, store)}
									>
										Pengiriman: <Sprites name='gosend' />
									</Checkbox>
									{
										typeof gosendInfo !== 'undefined' && gosendInfo.length > 0 && (
											<Tooltip
												position='left'
												label={
													<span role='button' style={{ marginLeft: '5px' }} tabIndex='-1' onClick={() => onShowGosendTooltip()}>
														<Icon name='exclamation-circle' class='fa fa-info-circle' />
													</span>
												}
											>
												{gosendInfo.length > 1 ? gosendInfo[1] : gosendInfo[0]} 
											</Tooltip>
										)
									}
								</div>
							)
						}
						{
							!hasLangLat() && (
								<div>
									<Checkbox 
										state={!hasLangLat() ? 'disabled' : ''}
										name='gojek'
										defaultChecked={false}
										style={{ display: 'inline-block', verticalAlign: 'top' }}
									>
										Pengiriman: <Sprites name='gosend' />
									</Checkbox>
									{
										typeof gosendInfo !== 'undefined' && gosendInfo.length > 0 && (
											<span role='button' style={{ marginLeft: '5px' }} tabIndex='-1' onClick={() => onShowGosendTooltip()}>
												<Icon name='exclamation-circle' class='fa fa-info-circle' />
											</span>
										)
									}
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