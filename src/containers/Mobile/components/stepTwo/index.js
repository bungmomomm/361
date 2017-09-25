import React, { Component } from 'react';
import { 
	Card,
	Checkbox,
	Tooltip,
	Level
} from '@/components';

import StoreBox from '@/containers/Checkout/components/Store/StoreBox';
import CheckoutProduct from '@/containers/Checkout/components/Product/CheckoutProduct';
import s from '@/containers/Checkout/components/Store/CheckoutResult.scss';


import { CheckoutList } from '@/data';

export default class StepTwo extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		return (
			<Card>
				<p><strong>2. Rincian Pesanan & Pengiriman</strong></p>
				{
					CheckoutList.map((checkout, index) => (
						<StoreBox
							name={checkout.store.name} 
							key={index}
							location={checkout.store.location}
						>
							{
								checkout.store.products.map((product, indexProduct) => (
									<CheckoutProduct 
										onUpdateQty={(data) => console.log(data)} 
										data={product} 
										key={indexProduct} 
									/>
								))
							}
							<div className={s.footer}>
								<div className={s.deliveryInfo}>
									*Pengiriman non Go-Send akan dilakukan 3-5 hari kerja
								</div>
								<div className={s.deliveryInfo}>
									<Level noMargin>
										<Level.Item>
											<Checkbox name='gojek' content='Pengiriman:' disabled sprites='gosend' />
										</Level.Item>
										<Level.Item>
											<Tooltip position='right' content='Info' color='white'>
												Mohon tidak memberikan biaya tambahan ke driver Go-Jek saat terima barang
											</Tooltip>
										</Level.Item>
									</Level>
									<a role='link' tabIndex='0' className='font-orange'>Mohon pilih titik lokasi pengiriman anda</a>
								</div>
								<div className={s.deliveryInfo}>
									<Level noMargin>
										<Level.Item>
											<Checkbox name='gojek' content='Pengiriman:' disabled sprites='gosend' />
										</Level.Item>
										<Level.Item>
											<Tooltip position='right' content='Info' color='white'>
												Mohon tidak memberikan biaya tambahan ke driver Go-Jek saat terima barang
											</Tooltip>
										</Level.Item>
									</Level>
									<div className='font-red'>Total berat barang melebihi batas maximal 7kg. Berat sekarang X kg</div>
								</div>
								<div className={s.deliveryInfo}>
									<Level noMargin>
										<Level.Item>
											<Checkbox name='gojek' content='Pengiriman:' sprites='gosend' />
										</Level.Item>
										<Level.Item>
											<Tooltip position='right' content='Info' color='white'>
												Mohon tidak memberikan biaya tambahan ke driver Go-Jek saat terima barang
											</Tooltip>
										</Level.Item>
									</Level>
								</div>
								<div className={s.price}>
									<div className={s.priceList}>
										<div>Biaya Pengiriman</div>
										<div>Rp 360.000</div>
									</div>
									<div className={s.priceListBold}>
										<div>Total</div>
										<div>Rp 915.000</div>
									</div>
								</div>
							</div>
						</StoreBox>
					))
				}
				
			</Card>
		);
	}
}