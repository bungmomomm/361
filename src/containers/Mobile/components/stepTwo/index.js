import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Cart';
import { withCookies } from 'react-cookie';
import { Card } from '@/components';
import { T } from '@/data/translations';

import StoreBox from './StoreBox';
import StoreBoxBody from './StoreBoxBody';
import StoreBoxFooter from './StoreBoxFooter';

class StepTwo extends Component {
	
	static fetchDataCart(token, dispatch) {
		dispatch(new actions.getCart(token));
	}

	static fetchPlaceOrderCart(token, dispatch, selectedAddress, billing, updatePaymentMethodList = true) {
		dispatch(new actions.getPlaceOrderCart(token, selectedAddress, billing, updatePaymentMethodList));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillMount() {
		if (this.props.cart === undefined) {
			// get initial cart data
			this.constructor.fetchDataCart(this.cookies, this.props.dispatch);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.stepState.stepOne.selectedAddress.id === 'undefined') {
			// fetch data cart when selected address empty
			this.constructor.fetchDataCart(
				this.cookies, 
				this.props.dispatch
			);
		}

		if (this.props.stepState.stepOne.selectedAddress !== nextProps.stepState.stepOne.selectedAddress) {
			// fetch data cart when selectedAddress change
			const billing = this.props.billing ? this.props.billing[0] : false;
			this.constructor.fetchPlaceOrderCart(this.cookies, this.props.dispatch, nextProps.stepState.stepOne.selectedAddress, billing, true);
		}
	}
	
	checkRestrictO2o(o2oSupported) {
		const { isPickupable, stepState } = this.props;
		return isPickupable === '0' && o2oSupported && stepState.stepOne.activeTab === 1;
	}

	updateShippingMethodGosend(checked, store) {
		const methodId = checked ? '19' : '';
		this.props.dispatch(new actions.updateGosend(this.cookies, store.id, methodId, { soNumber: this.props.soNumber }));
	}

	updateQty(qty, productId) {
		const { soNumber, dispatch } = this.props;
		if (soNumber.soNumber) {
			dispatch(new actions.updateQtyCart(this.cookies, qty.value, productId, { soNumber }));
		} else {
			dispatch(new actions.updateCartWithoutSO(this.cookies, qty.value, productId));
		}
	}
	
	deleteProduct(productId) {
		this.props.dispatch(new actions.deleteCart(this.cookies, productId));
	}

	render() {
		const selectedAddress = this.props.stepState.stepOne.selectedAddress;
		return (
			<Card loading={this.props.loading}>
				<p><strong>{T.checkout.STEP_TWO_LABEL}</strong></p>
				{
					this.props.cart.map((storeData, indexStoreBox) => {
						const restrictO2o = this.checkRestrictO2o(!storeData.store.shipping.o2oSupported);
						return (
							<StoreBox
								key={indexStoreBox}
								name={storeData.store.name} 
								color={restrictO2o ? 'red' : ''}
								location={storeData.store.location}
							>
								{
									storeData.store.products.map((product, indexProduct) => (
										<StoreBoxBody 
											key={indexProduct} 
											onUpdateQty={(e) => this.updateQty(e, product.id)} 
											data={product} 
											deleteProduct={() => this.deleteProduct(product.id)} 
											restrictO2o={restrictO2o}
										/>
									))
								}
								<StoreBoxFooter 
									stepOneActiveTab={this.props.stepState.stepOne.activeTab}
									selectedAddress={selectedAddress}
									checkGosendMethod={(checked, store) => this.updateShippingMethodGosend(checked, store)}
									data={storeData} 
								/>
							</StoreBox>
						);
					})
				}
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		addresses: state.addresses.addresses,
		billing: state.addresses.billing,
		cart: state.cart.data,
		soNumber: state.cart.soNumber,
		isPickupable: state.cart.isPickupable,
		loading: state.cart.loading
	};
};

export default withCookies(connect(mapStateToProps)(StepTwo));

