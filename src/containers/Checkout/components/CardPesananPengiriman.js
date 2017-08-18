import React, { Component } from 'react';
import styles from '../Checkout.scss';

// component load
import { Card } from '@/components/Base';
import StoreBox from './Store/StoreBox';
import CheckoutResult from './Store/CheckoutResult';
import CheckoutProduct from './Product/CheckoutProduct';

// Dummy Data
// import { CheckoutList } from '@/data';

export default class CardPesananPengiriman extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onDeleteCart = this.onDeleteCart.bind(this);
	}

	onDeleteCart(cart) {
		this.props.onDeleteCart(cart);
	}
	
	render() {
		return (
			<Card stretch>
				<div className={styles.overflow}>
					{
						
						this.props.cart.map((storeData, i) => (
							<StoreBox color='' key={i} name={storeData.store.name} location={storeData.store.location}>
								{
									storeData.store.products.map((product, index) => (
										<CheckoutProduct key={index} data={product} onDeleteCart={this.onDeleteCart} />
									))
								}
								<CheckoutResult key={i} shipping={storeData.store.shipping} price={storeData.store.price} />
							</StoreBox>
						))
					}
				</div>
			</Card>
		);
	}
};