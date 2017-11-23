import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Cart';
import { withCookies } from 'react-cookie';
import { T } from '@/data/translations';

import {
	Panel,
	Level,
	Icon
} from 'mm-ui';
import StoreBoxBody from './StoreBoxBody';
import StoreBoxFooter from './StoreBoxFooter';

import styles from '../../mobile.scss';

class StepTwo extends Component {
	
	static fetchDataCart(token, dispatch) {
		dispatch(new actions.getCart(token));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.cookies = this.props.cookies.get('user.token');
		this.loadedCart = false;
	}

	componentWillMount() {
		if (this.props.cart === undefined) {
			// get initial cart data
			this.constructor.fetchDataCart(this.cookies, this.props.dispatch);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.loadCart && this.props.stepState.stepOne.selectedAddress.id === undefined && this.props.cart[0].store.id === 0) {
			// fetch data cart when selected address empty
			this.constructor.fetchDataCart(
				this.cookies, 
				this.props.dispatch
			);
			this.loadCart = true;
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
		if (qty !== '') {
			const { soNumber, dispatch } = this.props;
			if (soNumber) {
				dispatch(new actions.updateQtyCart(this.cookies, qty, productId, { soNumber }));
			} else {
				dispatch(new actions.updateCartWithoutSO(this.cookies, qty, productId));
			}
		}
	}

	saveDisabledPayment(disable) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepFour: {
				...stepState.stepFour,
				disable
			}
		};
		this.props.applyState(checkoutState);
	}

	saveLoading(loading) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepTwo: {
				...stepState.stepTwo,
				loading
			}
		};
		this.props.applyState(checkoutState);
	}

	createClassCard() {
		return [
			styles.card, 
			this.props.loading ? styles.loading : ''
		].join(' ').trim();
	}

	render() {
		return (
			<div className={this.createClassCard()}>
				<p><strong>{T.checkout.STEP_TWO_LABEL}</strong><span> ({this.props.totalItems} items)</span></p>
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
										<Level.Right>{storeData.store.location && <div><Icon name='map-marker' /> {storeData.store.location}</div>}</Level.Right>
									</Level>
								}
							>
								{
									isJabotabekItem && (<div className='font-red' style={{ marginBottom: '15px' }}>
										{T.checkout.JABODETABEK_LABEL}
									</div>)
								}
								{
									isRestrictO2O && (<div className='font-red' style={{ marginBottom: '15px' }}>
										{T.checkout.O2O_SELLER_NOT_SUPPORT}
										</div>
									)
								}
								<StoreBoxBody 
									products={storeData.store.products}
									onUpdateQty={(e, productId) => this.updateQty(e, productId)}
									showBtnDelete={!(this.props.cart.length < 2 && storeData.store.products.length < 2)}
								/>
								<StoreBoxFooter 
									stepOneActiveTab={this.props.stepState.stepOne.activeTab}
									selectedAddress={this.props.stepState.stepOne.selectedAddress}
									showEditAddressModal={this.props.stepState.stepOne.funcShowModalAddress}
									checkGosendMethod={(checked, store) => this.updateShippingMethodGosend(checked, store)}
									isRestrictO2O={isRestrictO2O}
									isJabotabekItem={isJabotabekItem}
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
		loading: state.cart.loading,
		totalItems: state.cart.totalItems,
	};
};

export default withCookies(connect(mapStateToProps)(StepTwo));

