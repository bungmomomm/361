import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Cart';
import { withCookies } from 'react-cookie';
import { T } from '@/data/translations';
// import Tooltip from '@/containers/Mobile/components/shared/Tooltip';
import {
	Panel,
	Level,
	Icon
} from 'mm-ui';
import StoreBoxBody from './StoreBoxBody';
import StoreBoxFooter from './StoreBoxFooter';

import styles from '../../page.scss';
import { getRefreshToken } from '@/state/Auth/actions';
import { pushDataLayer } from '@/utils/gtm';

class StepTwo extends Component {
	
	static fetchDataCart(userToken, userRFToken, dispatch) {
		dispatch(new actions.getCart(userToken))
		.catch((error) => {
			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken,
					userRFToken
				})).then((response) => {
					dispatch(new actions.getCart(response.userToken));
				});
			}
		});
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.loadCart = false;
		this.state = {
			showGosendTooltip: false
		};
	}

	componentWillMount() {
		if (typeof this.props.cart === 'undefined') {
			// get initial cart data
			this.constructor.fetchDataCart(this.userCookies, this.userRFCookies, this.props.dispatch);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			!this.loadCart
		) {
			this.constructor.fetchDataCart(this.userCookies, this.userRFCookies, nextProps.dispatch);
			this.loadCart = true;
		}
	}

	onCloseGosendTooltip() {
		this.setState({
			showGosendTooltip: false
		});
	}

	onShowGosendTooltip() {
		this.setState({
			showGosendTooltip: true
		});
	}

	checkRestrictO2o(o2oSupported) {
		const { isPickupable, stepState } = this.props;
		return isPickupable === '0' && o2oSupported && stepState.stepOne.activeTab === 1;
	}

	checkJabotabekItem(fgLocation) {
		const { stepOne } = this.props.stepState;
		const { selectedAddress } = stepOne;
		const isCurrentAddressJabotabek = selectedAddress && (typeof selectedAddress.attributes !== 'undefined' && selectedAddress.attributes.isJabodetabekArea === '1');
		return fgLocation === '1' && stepOne.activeTab === 0 && !isCurrentAddressJabotabek && selectedAddress.id;
	}

	updateShippingMethodGosend(checked, store) {
		const { dispatch } = this.props;
		const methodId = checked ? '19' : '';
		dispatch(new actions.updateGosend(this.userCookies, store.id, methodId, { soNumber: this.props.soNumber }))
		.catch((error) => {
			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken: this.userCookies,
					userRFToken: this.userRFCookies
				})).then((response) => {
					dispatch(new actions.updateGosend(response.userToken, store.id, methodId, { soNumber: this.props.soNumber }));
				});
			}
		});
		const storeItems = this.props.cart.filter(e => e.store.id === store.id);
		if (storeItems[0]) {
			pushDataLayer('checkout', 'checkout', { step: 4, option: checked ? 'Gosend' : 'Regular Delivery' }, storeItems[0].store.products);
		} 
	}

	updateQty(qty, product) {
		const setDataLayer = (event, ecommerceEvent, quantity, prod, currencyCode = null) => {
			const products = [
				{
					id: prod.id,
					name: prod.name,
					price: prod.price,
					brand: prod.brand,
					category: prod.category,
					variant: '',
					qty: quantity
				}
			];
			pushDataLayer(event, ecommerceEvent, null, products, currencyCode);
		};

		const productId = product.id;
		if (qty !== '') { 
			const { soNumber, coupon, dispatch } = this.props;
			if (soNumber) {
				dispatch(new actions.updateQtyCart(this.userCookies, qty, productId, { soNumber, coupon }))
				.catch((error) => {
					if (error.response.data.code === 405) {
						dispatch(getRefreshToken({
							userToken: this.userCookies,
							userRFToken: this.userRFCookies
						})).then((response) => {
							dispatch(new actions.updateQtyCart(response.userToken, qty, productId, { soNumber, coupon }));
						});
					}
				});
			} else {
				dispatch(new actions.updateCartWithoutSO(this.userCookies, qty, productId))
				.catch((error) => {
					if (error.response.data.code === 405) {
						dispatch(getRefreshToken({
							userToken: this.userCookies,
							userRFToken: this.userRFCookies
						})).then((response) => {
							dispatch(new actions.updateCartWithoutSO(response.userToken, qty, productId));
						});
					}
				});
			}
			if (qty > product.qty) {
				setDataLayer('addToCart', 'add', qty - product.qty, product, 'IDR');
			} else {
				setDataLayer('removeFromCart', 'remove', product.qty - qty, product);
			}
		}
	}

	saveDisabledPayment(disabled) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepFour: {
				...stepState.stepFour,
				disabled
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
			this.props.loading ? styles.loading : '',
			this.props.disabled ? styles.disabled : ''
		].join(' ').trim();
	}

	render() {
		const { stepOne } = this.props.stepState;
		return (
			<div className={this.createClassCard()}>
				<p><strong>{T.checkout.STEP_TWO_LABEL}</strong><span> ({this.props.totalItems} items)</span></p>
				{
					this.props.cart.map((storeData, indexStoreBox) => {
						const isRestrictO2O = this.checkRestrictO2o(!storeData.store.shipping.o2oSupported);
						const isJabotabekItem = this.checkJabotabekItem(storeData.store.products[0].fgLocation);
						const isClosedStore = storeData.store.store_status === '2';
						return (
							<Panel
								key={indexStoreBox}
								color={isRestrictO2O || isJabotabekItem || isClosedStore ? 'red' : 'grey'}
								header={
									<Level isMobile>
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
									isClosedStore && (<div className='font-red' style={{ marginBottom: '15px' }}>
										{T.checkout.STORE_TEMPORARY_CLOSED}
									</div>)
								}
								<StoreBoxBody 
									products={storeData.store.products}
									stepOneActiveTab={stepOne.activeTab}
									onUpdateQty={(e, product) => this.updateQty(e, product)}
									showBtnDelete={!(this.props.cart.length < 2 && storeData.store.products.length < 2)}
								/>
								<StoreBoxFooter 
									stepOneActiveTab={stepOne.activeTab}
									selectedAddress={stepOne.selectedAddress}
									showEditAddressModal={typeof stepOne.funcShowModalAddress === 'function' && stepOne.funcShowModalAddress}
									checkGosendMethod={(checked, store) => this.updateShippingMethodGosend(checked, store)}
									isRestrictO2O={isRestrictO2O}
									isJabotabekItem={isJabotabekItem}
									data={storeData} 
									shippingDefault={!this.props.stepState.stepFour.disabled}
									gosendInfo={this.props.gosendInfo}
									onShowGosendTooltip={(e) => this.onShowGosendTooltip()}
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
		gosendInfo: state.cart.gosendInfo,
		coupon: state.coupon
	};
};

export default withCookies(connect(mapStateToProps)(StepTwo));

