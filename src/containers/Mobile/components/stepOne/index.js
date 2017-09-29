import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
import _ from 'lodash';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { 
	Segment,
	Alert, 
	Select, 
	InputGroup, 
	Level, 
	Tabs,
	Card,
	Icon, 
	Button 
} from '@/components';

// modal
import ModalAddress from './ModalAddress';
import Modalo2o from './Modalo2o';
import Dropshipper from './Dropshipper';
import ViewSelectedAddress from './ViewSelectedAddress';


import { Address } from '@/data';
import { T } from '@/data/translations';

class stepOne extends Component {

	static fetchDataAddress(token, dispatch) {
		dispatch(new actions.getAddresses(token));
	}
	
	static mapSelectedAddress(selectedAddress) {
		if (selectedAddress) {
			return {
				label: selectedAddress.attributes.addressLabel,
				value: selectedAddress.id
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showModalAddress: false,
			showModalo2o: false,
			selectedAddress: {},
			shipping: [],
			toggleSelectAddress: true
		};
		this.currentAddresses = [];
		this.toggleModalAddress = this.toggleModalAddress.bind(this);
		this.cookies = this.props.cookies.get('user.token');
		console.log(T);
	}

	componentDidMount() {
		console.log('masuk');
		if (this.props.addresses === undefined) {
			this.constructor.fetchDataAddress(this.cookies, this.props.dispatch);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.addresses !== nextProps.addresses) {
			this.currentAddresses = nextProps.addresses;
			const shipping = [];
			this.currentAddresses.map((value, index) => (
				shipping.push({
					value: value.id,
					label: !value.attributes.addressLabel ? value.attributes.fullname : value.attributes.addressLabel,
					info: `<strong>${value.attributes.fullname}</strong> <br />${
							value.attributes.address 
							}${value.attributes.district  
							}${value.attributes.city 
							}${value.attributes.province}`
				})
			));
			this.saveSelectedAddress(this.currentAddresses[0]);
			this.setState({
				shipping,
				selectedAddress: this.currentAddresses[0]
			});
		}
	}
	
	setSelectedAddress(selected) {
		const newSelectedAddress = _.find(this.currentAddresses, { id: selected.value });
		this.saveSelectedAddress(newSelectedAddress);
		this.setState({
			selectedAddress: newSelectedAddress
		});
	}

	toggleModalAddress(type) {
		this.flagModalAddress = type;
		this.setState({ showModalAddress: !this.state.showModalAddress });
	}

	hideModalAddress() {
		this.flagModalAddress = '';
		this.setState({ showModalAddress: false });
	}

	afterChangeTab(event) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				activeTab: event
			}
		};
		this.props.applyState(checkoutState);
	}

	saveSelectedAddress(selectedAddress) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				selectedAddress
			}
		};
		this.props.applyState(checkoutState);
	}


	showModalo2o() {
		this.setState({ showModalo2o: !this.state.showModalo2o });
	}
	
	render() {
		const { 
			selectedAddress,
			showModalAddress,
			showModalo2o,
			shipping
		} = this.state;

		if (!selectedAddress.attributes) {
			return null;
		}

		return (
			<Card>
				<p><strong>1. Pilih Metode &amp; Alamat Pengiriman</strong></p>
				<Tabs tabActive={0} stretch onAfterChange={(e) => this.afterChangeTab(e)}>
					<Tabs.Panel title='Kirim ke Alamat'>
						<Alert align='center' color='yellow' show >
							{T.address.FREE_ONGKIR_REGULATION}
						</Alert>
						{
							shipping.length > 0 ? (
								<div>
									<Segment>
										<InputGroup>
											<Select 
												filter 
												options={shipping}
												onChange={(id) => this.setSelectedAddress(id)}
												selected={this.constructor.mapSelectedAddress(this.state.selectedAddress)}
											/>
										</InputGroup>
										{
											selectedAddress.attributes.latitude 
											&& selectedAddress.attributes.longitude && (
												<Level>
													<Level.Item className='text-right'>
														<div>	
															<Icon name='map-marker' /> &nbsp; {T.address.LOCATION_MARKED}
														</div>
													</Level.Item>
												</Level>
											)
										}
										{
											<ViewSelectedAddress {...selectedAddress.attributes} />
										}
										<Level>
											<Level.Item>
												<Button onClick={() => this.toggleModalAddress('edit')} type='button' icon='pencil' iconPosition='left' className='font-orange' content={T.address.CHANGE_ADDRESS} />
											</Level.Item>
											<Level.Item className='text-right'>
												<Button onClick={() => this.toggleModalAddress('add')} type='button' icon='plus' iconPosition='left' className='font-orange' content={T.address.ADD_ADDRESS} />
											</Level.Item>
										</Level>
									</Segment>
									<Dropshipper />
								</div>		
							) : (
								<Button onClick={() => this.toggleModalAddress('add')} type='button' block color='orange' outline content={T.address.INPUT_DELIVERY_ADDRESS} />
							)
						}
					</Tabs.Panel>
					<Tabs.Panel title='Ambil di Toko/ E-locker (O2O)'>
						<Alert align='center' color='yellow' show >
							{T.elocker.REGULATION}
						</Alert>
						{
							this.props.latesto2o.length > 0 && (
								<div>
									<Alert close icon='ban' align='left' color='red' show >
										{T.elocker.ONE_OR_MORE_PRODUCT_NOT_SUPPORTED}
									</Alert>
									<Segment className='customSelectO2OWrapper'>
										<InputGroup>
											<Select options={Address} />
										</InputGroup>
										<p><strong>Aufar Syahdan</strong> </p>
										<p>
											Jl. Bangka II No.20 Rt.10/05 <br />
											Mampang Prapatan <br />
											Jakarta Selatan, DKI Jakarta, 12720 <br />
											Telepon: 08568052187
										</p>
										<Level>
											<Level.Item className='text-right'>
												<Button onClick={() => this.showModalo2o()} type='button' icon='plus' iconPosition='left' className='font-orange' content='Tambah Alamat' />
											</Level.Item>
										</Level>
									</Segment>
								</div>
							)
						}
						{
							this.props.latesto2o.length > 0 && this.props.isPickupable !== '0' && (
								<InputGroup>
									<Button onClick={() => this.showModalo2o()} type='button' block color='orange' outline content={T.elocker.CHOOSE_STORE} />
								</InputGroup>
							)
						}
						{
							this.props.isPickupable === '0' && (
								<p className='font-red'>{T.elocker.ONE_OR_MORE_PRODUCT_NOT_SUPPORTED}</p>
							)
						}
					</Tabs.Panel>
				</Tabs>
				{
					showModalAddress && (
						<ModalAddress 
							formData={this.flagModalAddress === 'edit' ? selectedAddress : null}
							show={showModalAddress}
							handleClose={() => this.hideModalAddress()} 
						/>
					)
				}
				<Modalo2o show={showModalo2o} handleClose={() => this.showModalo2o()} />
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		addresses: state.addresses.addresses,
		isPickupable: state.cart.isPickupable,
		listo2o: state.addresses.o2o,
		latesto2o: state.addresses.latesto2o,
		o2oProvinces: state.addresses.o2oProvinces
	};
};

export default withCookies(connect(mapStateToProps)(stepOne));

