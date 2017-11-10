import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Cart';
import { withCookies } from 'react-cookie';
import { T } from '@/data/translations';

import {
	Panel,
	Level,
	Icon,
} from 'mm-ui';
import StoreBoxBody from './StoreBoxBody';
import StoreBoxFooter from './StoreBoxFooter';

import styles from '../../mobile.scss';

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

	checkJabotabekItem(fgLocation) {
		const { stepState } = this.props;
		const isCurrentAddressJabotabek = stepState.stepOne.selectedAddress && stepState.stepOne.selectedAddress.attributes.isJabodetabekArea === '1';
		return fgLocation === '1' && stepState.stepOne.activeTab === 0 && !isCurrentAddressJabotabek;
	}

	updateShippingMethodGosend(checked, store) {
		const methodId = checked ? '19' : '';
		this.props.dispatch(new actions.updateGosend(this.cookies, store.id, methodId, { soNumber: this.props.soNumber }));
	}

	updateQty(qty, productId) {
		const { soNumber, dispatch } = this.props;
		if (soNumber) {
			dispatch(new actions.updateQtyCart(this.cookies, qty, productId, { soNumber }));
		} else {
			dispatch(new actions.updateCartWithoutSO(this.cookies, qty, productId));
		}
	}
	
	deleteProduct(productId) {
		this.props.dispatch(new actions.deleteCart(this.cookies, productId));
	}

	render() {
		return (
			<div className={styles.card}>
				<p><strong>{T.checkout.STEP_TWO_LABEL}</strong></p>
				{
					this.props.cart.map((storeData, indexStoreBox) => {
						const isRestrictO2O = this.checkRestrictO2o(!storeData.store.shipping.o2oSupported);
						const isJabotabekItem = this.checkJabotabekItem(storeData.store.products[0].fgLocation);
						return (
							<Panel
								key={indexStoreBox}
								color={isRestrictO2O || isJabotabekItem ? 'red' : 'grey'}
								header={
									<Level>
										<Level.Left>{storeData.store.name}</Level.Left>
										<Level.Right><Icon name='map-marker' /> {storeData.store.location}</Level.Right>
									</Level>
								}
							>
								<StoreBoxBody 
									products={storeData.store.products}
									onUpdateQty={(e, productId) => this.updateQty(e, productId)}
									isRestrictO2O={isRestrictO2O}
									showBtnDelete={!(this.props.cart.length < 2 && storeData.store.products.length < 2)}
								/>
								<StoreBoxFooter 
									stepOneActiveTab={this.props.stepState.stepOne.activeTab}
									selectedAddress={this.props.stepState.stepOne.selectedAddress}
									checkGosendMethod={(checked, store) => this.updateShippingMethodGosend(checked, store)}
									data={storeData} 
								/>
							</Panel>
						);
					})
				}
			</div>
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

