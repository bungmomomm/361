import React, { Component } from 'react';
import styles from '../Checkout.scss';
import { StoreBox } from '@/components/Store';
import { CheckoutProduct, CheckoutResult } from '@/components/Product';

// component load
import { Card } from '@/components/Base';

// Dummy Data
import { 
	CheckoutList
} from '@/data';

export default class CardPesananPengiriman extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	
	render() {
		return (
			<Card stretch>
				<div className={styles.overflow}>
					{
						CheckoutList.map((storeData, i) => (
							<StoreBox key={i} name={storeData.store.name} location={storeData.store.location}>
								{
									storeData.store.products.map((product, index) => (
										<CheckoutProduct key={index} data={product} />
									))
								}
								<CheckoutResult key={i} gosend={storeData.store.gosend} />
							</StoreBox>
						))
					}
				</div>
			</Card>
		);
	}
};