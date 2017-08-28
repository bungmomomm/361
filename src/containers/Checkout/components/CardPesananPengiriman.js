import React, { Component } from 'react';
import styles from '../Checkout.scss';

// component load
import { Card } from '@/components';
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
		this.onUpdateQty = this.onUpdateQty.bind(this);
	}

	onDeleteCart(cart) {
		this.props.onDeleteCart(cart);
	}

	onUpdateQty(qty, id) {
		this.props.onUpdateQty(qty, id);
	}
	
	render() {
		return (
			<Card stretch>
				<div className={styles.overflow}>
					{

						this.props.cart.map((storeData, i) => (
							<StoreBox 
								loading={this.props.loadingUpdateCart} 
								color={this.props.restrictO2o && !storeData.store.shipping.o2oSupported ? 'red' : ''} 
								key={i} 
								name={storeData.store.name} 
								location={storeData.store.location}
							>
								{
									storeData.store.products.map((product, index) => (
										<CheckoutProduct showBtnDelete={this.props.cart.length < 2 && storeData.store.products.length < 2 ? 0 : 1} restrictO2o={this.props.restrictO2o && !storeData.store.shipping.o2oSupported} key={index} data={product} onDeleteCart={this.onDeleteCart} onUpdateQty={this.onUpdateQty} />
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