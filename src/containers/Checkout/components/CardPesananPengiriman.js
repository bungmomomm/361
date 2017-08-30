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
		this.checkGosendMethod = this.checkGosendMethod.bind(this);
	}

	onDeleteCart(cart) {
		this.props.onDeleteCart(cart);
	}

	onUpdateQty(qty, id) {
		this.props.onUpdateQty(qty, id);
	}

	checkGosendMethod(checked, value) {
		this.props.shippingMethodGosend(checked ? '19' : '', value);
	}
	
	render() {
		return (
			<Card stretch loading={this.props.loading} >
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
								<CheckoutResult addressTabActive={this.props.addressTabActive} key={i} shipping={storeData.store.shipping} price={storeData.store.price} checkGosendMethod={this.checkGosendMethod} store={storeData.store.id} selectedAddress={this.props.selectedAddress} />
							</StoreBox>
						))
					}
				</div>
			</Card>
		);
	}
};