import React, { Component } from 'react';
import { 
	Card,
} from '@/components';

import StoreBox from '@/containers/Checkout/components/Store/StoreBox';
import CheckoutProduct from '@/containers/Checkout/components/Product/CheckoutProduct';


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
						</StoreBox>
					))
				}
				
			</Card>
		);
	}
}