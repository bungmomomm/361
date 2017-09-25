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

class stepOne extends Component {

	static fetchDataAddress(token, dispatch) {
		dispatch(new actions.getAddresses(token));
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
	}

	componentWillMount() {
		if (this.props.address.length === undefined) {
			this.constructor.fetchDataAddress(this.cookies, this.props.dispatch);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.address.addresses !== nextProps.address.addresses) {
			this.currentAddresses = nextProps.address.addresses;
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
			this.setState({
				shipping,
				selectedAddress: this.currentAddresses[0]
			});
		}
	}
	
	setSelectedAddress(selected) {
		const newSelectedAddress = _.find(this.currentAddresses, { id: selected.value });
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
		console.log(this);
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
				<Tabs tabActive={0} stretch onAfterChange={(event) => this.afterChangeTab(event)}>
					<Tabs.Panel title='Kirim ke Alamat'>
						<Alert align='center' color='yellow' show >
							Gratis ongkos kirim hingga Rp 15,000 untuk minimal pembelian sebesar Rp 100,000
						</Alert>
						<Segment>
							<InputGroup>
								<Select 
									filter 
									options={shipping}
									onChange={(id) => this.setSelectedAddress(id)}
								/>
							</InputGroup>
							<InputGroup>
								<Button onClick={() => this.toggleModalAddress('add')} type='button' icon='plus' iconPosition='left' className='font-orange' content='Tambah Alamat' />
							</InputGroup>
							<Level>
								<Level.Item className='text-right'>
									<div>	
										<Icon name='map-marker' /> &nbsp; Lokasi Sudah Ditandai
									</div>
								</Level.Item>
							</Level>
							{
								<ViewSelectedAddress {...selectedAddress.attributes} />
							}
							<Button onClick={() => this.toggleModalAddress('edit')} type='button' icon='pencil' iconPosition='left' className='font-orange' content='Ubah Alamat ini' />
						</Segment>
						<Dropshipper />
						<Button onClick={() => this.toggleModalAddress('add')} type='button' block color='orange' outline content='Masukan Alamat Pengiriman' />
					</Tabs.Panel>
					<Tabs.Panel title='Ambil di Toko/ E-locker (O2O)'>
						<Alert align='center' color='yellow' show >
							Maksimum 5 kg per order untuk Ambil Di Toko / Elocker (020). Pesanan diatas 5 kg akan dikirimkan langsung ke alamat Anda. <br /> GRATIS ongkos kirim hingga Rp 15,000 untuk minimal pembelian sebesar Rp 100,000
						</Alert>
						<Alert close icon='ban' align='left' color='red' show >
							Satu atau lebih produk dalam keranjang belanja anda tidak menyediakan layanan Ambil di Toko / Elocker (O2O)
						</Alert>
						<Segment className='customSelectO2OWrapper'>
							<InputGroup>
								<Select 
									options={Address} 
									selected={Address[0]} 
								/>
							</InputGroup>
							<InputGroup>
								<Button onClick={() => this.toggleModalAddress('add')} type='button' icon='plus' iconPosition='left' className='font-orange' content='Tambah Alamat' />
							</InputGroup>
							<p><strong>Aufar Syahdan</strong> </p>
							<p>
								Jl. Bangka II No.20 Rt.10/05 <br />
								Mampang Prapatan <br />
								Jakarta Selatan, DKI Jakarta, 12720 <br />
								Telepon: 08568052187
							</p>
						</Segment>
						<InputGroup>
							<Button onClick={() => this.showModalo2o()} type='button' block color='orange' outline content='Pilih Lokasi Toko / E-locker' />
						</InputGroup>
						<p className='font-red'>Satu atau lebih produk dalam keranjang belanja anda tidak menyediakan layanan Ambil di Toko / Elocker (O2O)</p>
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
		address: state.addresses
	};
};

export default withCookies(connect(mapStateToProps)(stepOne));

