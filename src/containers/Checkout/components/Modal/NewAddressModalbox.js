import React, { Component } from 'react';
import styles from '../../Checkout.scss';
import humps from 'lodash-humps';
import { Validator } from 'ree-validate';

// component load
import { Gosend, Icon, Textarea, Modal, Level, Input, InputGroup, Select, Alert, Segment, Button } from '@/components';

import { Polygon } from '@/data/polygons';

import { renderIf } from '@/utils';

// Dummy Data
// import { Provinsi } from '@/data';

export default class NewAddressModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.validator = new Validator({
			name: 'required',
			penerima: 'required',
			no_hp: 'required|digits:6|max:14',
			provinsi: 'required',
			kecamatan: 'required',
			kodepos: 'required',
			address: 'required',
			id: 'required',
			isEdit: 'required'
		});

		this.state = {
			formData: {
				id: this.props.formDataAddress.id || 0,
				name: this.props.formDataAddress.label,
				penerima: this.props.formDataAddress.nama,
				no_hp: this.props.formDataAddress.noHP,
				provinsi: this.props.formDataAddress.kotProv,
				kecamatan: this.props.formDataAddress.kecamatan,
				kodepos: this.props.formDataAddress.kodepos,
				address: this.props.formDataAddress.address,
				isEdit: this.props.formDataAddress.isEdit || false
			},
			errors: this.validator.errorBag,
			district: {},
			enableGosend: false,
			gosendData: {}, 
			formattedAddress: ''
		};
		this.onChange = this.onChange.bind(this);
		this.onChangeSelect = this.onChangeSelect.bind(this);
		this.onSubmitAddress = this.onSubmitAddress.bind(this);
		this.onGeoLoad = this.onGeoLoad.bind(this);
		this.validateAndSubmit = this.validateAndSubmit.bind(this);
		this.getDistricts = this.getDistricts.bind(this);
		this.kecamatan = null;
	}

	onChange(e) {
		console.log(e);
		const name = e.target.name;
		const value = e.target.value;
		this.setErrors(name, value);
	}

	onChangeSelect(e) {
		if (e.name === 'provinsi') {
			this.getDistricts(e.value);
			const enableGosend = e.label.toLowerCase().includes('jakarta');
			this.setState({
				enableGosend
			});
		}
		
		if (e.name === 'kecamatan') {
			this.kecamatan = humps(e.value.toLowerCase());
			
			const PolygonResult = Polygon.map((option) => {
				return option[this.kecamatan] ? option : null;
			}).filter((option) => {
				return option;
			});
			
			if (PolygonResult.length > 0) {
				this.setState({
					gosendData: {
						center: PolygonResult[0][this.kecamatan].center,
						location_coords: PolygonResult[0][this.kecamatan].location_coords
					}
				});
			}	
		}
		this.setErrors(e.name, e.value);
	}

	onSubmitAddress(formData) {
		this.props.onSubmitAddress(formData);
	}

	onGeoLoad(lat, long, formattedAddress) {
		console.log(formattedAddress);
		this.setState({
			formattedAddress, 
			isEdit: true
		});
	}

	getDistricts(cityProv) {
		this.props.getDistricts(cityProv);
	}

	setErrors(name, value) {
		const { formData } = this.state;
		formData[name] = value;
		this.validator.validate(name, value).then(() => {
			const { errorBag } = this.validator;
			this.setState({ 
				errors: errorBag, formData 
			});
		});
	}

	submit(formData) {
		this.onSubmitAddress(formData);
	}

	validateAndSubmit(e) {
		e.preventDefault();
		const { formData } = this.state;
		this.validator.validateAll(formData).then(success => {
			if (success) {
				this.submit(formData);
			} else {
				Object.keys(formData).forEach((key) => {
					this.setErrors(key, this.state.formData[key]);
				});
			}
		});
	}

	
	render() {
		const { 
			errors,
			gosendData,
			enableGosend, 
			isEdit
		} = this.state;
		console.log(this.state);
		return (
			<Modal size='medium' shown={this.props.shown}>
				<Modal.Header>
					<div>{ this.props.formDataAddress.isEdit ? 'Ubah Alamat' : 'Buat Alamat Baru'}</div>
				</Modal.Header>
				<Modal.Body>
					<div className={styles.overflow} ref={(overflow) => { this.fieldOverflow = overflow; }}>
						<InputGroup>
							<Input 
								label='Simpan Sebagai' 
								horizontal
								onChange={this.onChange}
								placeholder='Contoh: rumah, kantor, rumah pacar'
								name='name'
								error={errors.has('name')}
								message={errors.has('name') ? 'Name field is required.' : ''}
								type='text'
								value={typeof this.props.formDataAddress.label !== 'undefined' ? this.props.formDataAddress.label : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Input 
								label='Nama Penerima'
								horizontal
								required
								onChange={this.onChange}
								placeholder='Masukan nama lengkap penerima'
								name='penerima'
								error={errors.has('penerima')}
								message={errors.has('name') ? 'Penerima field is required.' : ''}
								type='text'
								value={typeof this.props.formDataAddress.nama !== 'undefined' ? this.props.formDataAddress.nama : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Input 
								label='No Handphone'
								horizontal
								required
								onChange={this.onChange}
								placeholder='Contoh : 08123456789'
								name='no_hp'
								error={errors.has('no_hp')}
								message={errors.has('name') ? 'No Hp field is required.' : ''}
								type='number'
								value={typeof this.props.formDataAddress.noHP !== 'undefined' ? this.props.formDataAddress.noHP : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Select 
								horizontal
								label='Kota, Provinsi'
								filter
								required
								name='provinsi'
								selectedLabel={typeof this.props.formDataAddress.kotProv !== 'undefined' ? this.props.formDataAddress.kotProv : '-- Silakan Pilih'} 
								onChange={this.onChangeSelect}
								error={errors.has('provinsi')}
								message={errors.has('provinsi') ? 'Provinsi field is required.' : ''}
								options={this.props.cityProv || []} 
							/>
						</InputGroup>
						{
							renderIf(this.props.district)(
								<InputGroup>
									<Select 
										horizontal
										label='Kecamatan'
										name='kecamatan' 
										filter
										required
										selectedLabel={typeof this.props.formDataAddress.kecamatan !== 'undefined' ? this.props.formDataAddress.kecamatan : '-- Silakan Pilih'} 
										onChange={this.onChangeSelect}
										error={errors.has('kecamatan')}
										message={errors.has('kecamatan') ? 'Kecamatan field is required.' : ''}
										options={this.props.district || []} 
									/>
								</InputGroup>
							)
						}
						<InputGroup>
							<Input 
								label='Kode Pos'
								horizontal
								required
								placeholder='Contoh : 12345'
								name='kodepos'
								type='number'
								onChange={this.onChange}
								error={errors.has('kodepos')}
								message={errors.has('kodepos') ? 'Kode Pos field is required.' : ''}
								value={typeof this.props.formDataAddress.kodepos !== 'undefined' ? this.props.formDataAddress.kodepos : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Textarea 
								horizontal
								label='Alamat'
								required
								placeholder='Masukkan Alamat Lengkap'
								name='address'
								onChange={this.onChange}
								error={errors.has('address')}
								message={errors.has('address') ? 'Address field is required.' : ''}
								value={typeof this.props.formDataAddress.address !== 'undefined' ? this.props.formDataAddress.address : ''}
							/>
						</InputGroup>
						<Alert color='yellow'>
							<small>
								<em>
									Harap tidak mengisi alamat pickup point O2O tanpa melalui pilihan menu Ambil di Toko
									(O2O). Kami tidak bertanggung jawab bila terjadi kehirlangan
								</em>
							</small>
						</Alert>
						{
							renderIf(enableGosend)(
								<Gosend
									zoom={15} 
									center={gosendData.center} 
									polygonArea={gosendData.location_coords} 
									onGeoLoad={this.onGeoLoad}
								/>
							)
						}
						{
							renderIf(enableGosend && isEdit)(
								<div>
									<Segment row>
										<Level padded>
											<Level.Item>
												<Icon name='map-marker' />
											</Level.Item>
											<Level.Item>
												{
													this.state.formattedAddress
												}
											</Level.Item>
											<Level.Item>
												<button className='font-small font-orange'>Ganti Lokasi</button>
											</Level.Item>
										</Level>
									</Segment>
									<p className='font-small font-orange'>Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.</p>
								</div>
							)
						}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Level>
						<Level.Left>
							<em>* wajib diisi</em>
						</Level.Left>
						<Level.Right>
							<Button block type='button' onClick={this.validateAndSubmit} content='Simpan Alamat' color='dark' />
						</Level.Right>
					</Level>
				</Modal.Footer>
			</Modal>
		);
	}
};