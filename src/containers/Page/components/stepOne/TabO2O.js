import { connect } from 'react-redux';
// import _ from 'lodash';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import {
	Alert,
	Panel,
	Group,
	Level,
	Icon,
	Button
} from 'mm-ui';
import { T } from '@/data/translations';

import styles from '../../page.scss';
import Modalo2o from './Modalo2o';

class TabO2O extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showModalo2o: false,
			selectedAddressO2O: {},
			selectedProvinceO2O: null
		};
	}

	onPlaceOrder(address, dropshipper = null) {		
		address.type = 'pickup';
		address.attributes.is_dropshipper = false;
		this.props.onPlaceOrder(address);
	}

	setSelectedAddressO2O(selectedAddressO2O, selectedProvinceO2O) {
		this.saveSelectedAddress(selectedAddressO2O, 'selectedAddressO2O');
		this.setState({
			selectedAddressO2O,
			selectedProvinceO2O
		});
		this.toggleModalo2o();
		this.onPlaceOrder(selectedAddressO2O);
	}

	setStateDefaultElocker(stepState, latesto2o) {
		// set default elocker
		if (!stepState.stepOne.selectedAddressO2O && latesto2o && latesto2o.length > 0) {
			stepState = {
				...stepState,
				stepOne: {
					...stepState.stepOne,
					selectedAddressO2O: latesto2o[0]
				}
			};
			this.setState({
				selectedAddressO2O: latesto2o[0]
			});
		}
		return stepState;
	}

	toggleModalo2o() {
		this.setState({ showModalo2o: !this.state.showModalo2o });
	}

	saveSelectedAddress(selectedAddress, selectedAddressType = 'selectedAddress') {
		let { stepState } = this.props;
		stepState = this.setStateDefaultElocker(stepState, this.props.latesto2o);
		
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				[selectedAddressType]: selectedAddress
			}
		};
		this.props.applyState(checkoutState);
	}

	showModalo2o(type) {
		this.setState({ showModalo2o: true });
	}

	hideModalo2o() {
		this.setState({ showModalo2o: false });
	}

	renderO2OContentFirstCustomer() {
		if (this.props.latesto2o.length < 1 && this.props.isPickupable === '1' && !this.state.selectedAddressO2O.attributes) {
			return (
				<Panel className='customSelectO2OWrapper'>
					<Group>
						<Button block onClick={() => this.showModalo2o()} >
							<Level>
								<Level.Left className={styles.elipsis}>{T.checkout.CHOOSE_STORE}</Level.Left>
								<Level.Right><Icon name='angle-down' /></Level.Right>
							</Level>
						</Button>
					</Group>
				</Panel>
			);
		}
		return null;
	}

	renderO2OContent() {
		const { selectedAddressO2O } = this.state;
		if (selectedAddressO2O.attributes && this.props.isPickupable === '1') {
			return (
				<Panel className='customSelectO2OWrapper'>
					<Group>
						<Button block onClick={() => this.showModalo2o()}>
							<Level isMobile>
								<Level.Left style={{ maxWidth: '240px' }} className={styles.elipsis}>{selectedAddressO2O.attributes.address_label}</Level.Left>
								<Level.Right><Icon name='angle-down' /></Level.Right>
							</Level>
						</Button>
					</Group>
					<p><strong>{selectedAddressO2O.attributes.address_label}</strong> </p>
					<p>{selectedAddressO2O.attributes.address}</p>
					<Level>
						<Level.Item className='text-right'>
							<div
								role='button'
								tabIndex={-1}
								className='font-orange'
								onClick={() => this.showModalo2o()}
							>
								{/* <Icon name='plus' /> {T.checkout.ADD_ADDRESS}  */}
							</div>
						</Level.Item>
					</Level>
				</Panel>
			);
		}
		return null;
	}

	render() {
		return (
			<div>
				<Alert color='yellow' style={{ marginBottom: '15px', textAlign: 'center' }} safeHtml={T.checkout.REGULATION} />
				{
					this.props.isPickupable !== '1' && 
					<Alert close icon='ban' color='red' style={{ marginBottom: '15px', textAlign: 'center' }} safeHtml={T.checkout.ONE_OR_MORE_PRODUCT_NOT_SUPPORTED} />
				}
				{this.renderO2OContent()}
				{this.renderO2OContentFirstCustomer()}
				{
					this.state.showModalo2o &&
					<Modalo2o
						open
						o2oProvinces={this.props.o2oProvinces}
						handleClose={() => this.hideModalo2o()}
						selectedAddressO2O={this.state.selectedAddressO2O}
						selectedProvinceO2O={this.state.selectedProvinceO2O}
						onChange={(e, p) => this.setSelectedAddressO2O(e, p)}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		latesto2o: state.addresses.latesto2o,
		isPickupable: state.cart.isPickupable,
		o2oProvinces: state.addresses.o2oProvinces,
	};
};

export default withCookies(connect(mapStateToProps)(TabO2O));

