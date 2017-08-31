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
		this.state = {
			cartJabodetabek: [],
		};
		this.onDeleteCart = this.onDeleteCart.bind(this);
		this.onUpdateQty = this.onUpdateQty.bind(this);
		this.checkGosendMethod = this.checkGosendMethod.bind(this);
		this.onPinPointAddress = this.onPinPointAddress.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		const selectedAddress = nextProps.selectedAddress;
		const cart = nextProps.cart;
		const cartJabodetabek = [];
		if (cart.length > 0 && selectedAddress) {
			cart.forEach((value, index) => {
				
				value.store.products.forEach((x, y) => {
					if (x.fgLocation === '1' && selectedAddress.attributes.isJabodetabekArea === '0') {
						cartJabodetabek.push(
							value.store.id
						);
					}
				});
			});
			
			this.setState({
				cartJabodetabek
			});
		}
	}

	onDeleteCart(cart) {
		this.props.onDeleteCart(cart);
	}

	onUpdateQty(qty, id) {
		this.props.onUpdateQty(qty, id);
	}
	
	onPinPointAddress() {
		this.props.onChangeAddress(this.props.selectedAddress, 'edit');
	}

	checkGosendMethod(checked, value) {
		this.props.shippingMethodGosend(checked ? '19' : '', value);
	}
	
	render() {
		// || (storeData.store.id.indexOf(this.state.cartJabodetabek) === -1)
		console.log('cartnya', this.props.cart);
		console.log('aaa', this.state.cartJabodetabek);
		
		return (
			<Card stretch loading={this.props.loading} >
				<div className={styles.overflow}>
					{

						this.props.cart.map((storeData, i) => (
							<StoreBox 
								loading={this.props.loadingUpdateCart} 
								color={(this.props.restrictO2o && !storeData.store.shipping.o2oSupported) || (this.state.cartJabodetabek.indexOf(storeData.store.id) !== -1) ? 'red' : ''} 
								key={i} 
								name={storeData.store.name} 
								location={storeData.store.location}
							>
								{
									storeData.store.products.map((product, index) => (
										<CheckoutProduct showBtnDelete={this.props.cart.length < 2 && storeData.store.products.length < 2 ? 0 : 1} restrictO2o={this.props.restrictO2o && !storeData.store.shipping.o2oSupported} key={index} data={product} onDeleteCart={this.onDeleteCart} onUpdateQty={this.onUpdateQty} />
									))
								}
								<CheckoutResult onChangeAddress={this.onPinPointAddress} gosendInfo={this.props.gosendInfo} addressTabActive={this.props.addressTabActive} key={i} shipping={storeData.store.shipping} price={storeData.store.price} checkGosendMethod={this.checkGosendMethod} store={storeData.store.id} selectedAddress={this.props.selectedAddress} />
							</StoreBox>
						))
					}
				</div>
			</Card>
		);
	}
};