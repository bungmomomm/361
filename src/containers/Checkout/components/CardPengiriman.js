import React, { Component } from 'react';

// component load
import { 
	Level, 
	InputGroup, 
	Select,  
	Icon,
	Button, 
	Tabs,
	Alert,
	Segment,
} from '@/components';
import { renderIf } from '@/utils';

import Dropshipper from './Dropshipper';

// Dummy Data
// import { ElockerList } from '@/data';

export default class CardPengiriman extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			elockerTab: false,
			shipping: [],
			o2o: [],
			selectedAddress: this.props.selectedAddress || null,
			closeSelect: true,
		};
		this.onChoisedAddress = this.onChoisedAddress.bind(this);
		this.onChangeAddress = this.onChangeAddress.bind(this);
		this.onGetListO2o = this.onGetListO2o.bind(this);
		this.onChosenLocker = this.onChosenLocker.bind(this);
		this.openModal = this.openModal.bind(this);
	}

	componentWillMount() {
		const shipping = this.props.addresses;
		const address = [];
		if (typeof shipping !== 'undefined') {
			shipping.forEach((value, index) => {
				address.push({
					value: value.id,
					label: !value.attributes.address_label ? value.attributes.fullname : value.attributes.address_label,
					info: `${value.attributes.address}, ${value.attributes.district}, ${value.attributes.city}, ${value.attributes.province}`
				});
			});
			// console.log(address);
			this.setState({
				shipping: address
			});
		}
		
	}

	onChoisedAddress(dataChoised) {
		const selectedAddress = this.props.addresses.find(e => e.id === dataChoised.value);
		this.setState({
			selectedAddress
		});
		this.props.onChoisedAddress(selectedAddress);
	}

	onChangeAddress(e) {
		this.props.onChangeAddress(this.state.selectedAddress, e);
	}

	onChosenLocker(dataChosen) {
		const selectedLocker = this.props.latesto2o.find(e => e.value === dataChosen.value);
		this.props.onSelectedLocker(selectedLocker);
	}

	onGetListO2o(event) {
		if (!this.state.elockerTab) {
			this.setState({
				elockerTab: true
			});
			this.props.activeShippingTab(false);
			if (!this.props.listo2o) {
				this.props.onGetListO2o();
				this.props.onGetO2oProvinces();
			}
		} else {
			this.setState({
				elockerTab: false
			});
			this.props.activeShippingTab(true);
		}
		if (this.props.latesto2o.length > 0) {
			this.props.onSelectedLocker(this.props.latesto2o[0]);	
		}
	}

	openModal(even) {
		this.props.onOpenModalO2o();
		this.setState({
			closeSelect: true
		});
	}

	render() {
		const addMoreButton = (
			<Button
				onClick={this.openModal}
				content='Ganti Toko E-Locker Lainnya'
				className='font-orange'
				icon='pencil'
				iconPosition='left'
			/>
		);

		const addMoreAddress = (
			<Button
				onClick={() => this.onChangeAddress('add')}
				content='Tambah Alamat Baru'
				className='font-orange'
				icon='plus'
				iconPosition='left'
			/>
		);

		return (
			<Tabs tabActive={0} stretch onAfterChange={this.onGetListO2o} >
				<Tabs.Panel title='Kirim ke Alamat' sprites='truck-off' spritesActive='truck-on'>
					<Alert align='center' color='yellow'>
						Gratis ongkos kirim hingga Rp 15,000 untuk minimal pembelian sebesar Rp 100,000
					</Alert>
					<Segment>
						<InputGroup>
							<Select 
								name='alamat'
								filter 
								selectedLabel='-- Pilih Alamat Lainnya' 
								options={this.state.shipping} 
								onChange={this.onChoisedAddress}
								addButton={addMoreAddress}
							/>
						</InputGroup>
						{
							!this.state.selectedAddress ? null : 
							<div>
								<Level>
									<Level.Left><strong>{this.state.selectedAddress.attributes.address_label}</strong></Level.Left>
									<Level.Right className='text-right'><Icon name='map-marker' /> &nbsp; Lokasi Sudah Ditandai</Level.Right>
								</Level>
								<p>
									{this.state.selectedAddress.attributes.fullname} <br />
									{this.state.selectedAddress.attributes.address} <br />
									{this.state.selectedAddress.attributes.district}, {this.state.selectedAddress.attributes.city}, {this.state.selectedAddress.attributes.province}, {this.state.selectedAddress.attributes.zipcode} <br />
									P: {this.state.selectedAddress.attributes.phone}
								</p> 
								<Button type='button' icon='pencil' iconPosition='left' className='font-orange' content='Ubah Alamat ini' onClick={this.onChangeAddress} />
							</div>
						}
					</Segment>
					{
						!this.state.selectedAddress ? null : 
						<Dropshipper setDropship={this.props.setDropship} errorDropship={this.props.errorDropship} checkDropship={this.props.checkDropship} />
					}
					{
						renderIf(this.state.shipping.length === 0)(
							<Button content='Masukan Alamat Pengiriman' color='dark' block size='large' iconPosition='right' icon='angle-right' onClick={() => this.onChangeAddress('add')} />
						)
					}
					
				</Tabs.Panel>
				<Tabs.Panel title='Ambil Di Toko/E-locker (O2O)' sprites='o2o-off' spritesActive='o2o-on' >
					<Alert align='center' color='yellow' show={this.state.elockerTab} >
						Maksimum 2 kg perorder untuk Ambil di Toko. Pesanan diatas 2 kg akan langsung dikirimkan ke Alamat Anda.
					</Alert>
					{
						this.props.isPickupable === '0' ? null :
						!this.props.selectedLocker ? <Button onClick={this.openModal} content='Pilih Lokasi Toko / E-locker' color='dark' block size='large' iconPosition='right' icon='angle-right' /> :
						<div>
							<Segment>
								<InputGroup>
									<Select
										selectedLabel={this.props.selectO2oFromModal ? '-- Pilih Lokasi / Toko E-Locker Lainnya' : this.props.selectedLocker.attributes.address_label}
										selected={this.props.selectO2oFromModal ? {} : this.props.selectedLocker}
										options={(typeof this.props.latesto2o !== 'undefined') ? this.props.latesto2o : []}
										onChange={this.onChosenLocker}
										addButton={addMoreButton}
										shown={!this.state.closeSelect}
									/>
								</InputGroup>
								<Level>
									<Level.Left><strong>{this.props.selectedLocker.attributes.address_label} &nbsp; </strong></Level.Left>
								</Level>
								<p>
									{this.props.selectedLocker.attributes.address} <br />
									Telp: {this.props.selectedLocker.attributes.phone}
								</p>
							</Segment>
						</div>
					}
					{this.props.isPickupable === '0' ? <p className='font-red'>Satu atau lebih produk dalam keranjang belanja anda tidak menyediakan layanan Ambil di Toko / Elocker (O2O)</p> : null }
				</Tabs.Panel>
			</Tabs>
		);
	}
};