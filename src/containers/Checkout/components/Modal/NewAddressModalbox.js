import React, { Component } from 'react';
import styles from '../../Checkout.scss';
import { Validator } from 'ree-validate';

// component load
import { Gosend, Icon, Textarea, Modal, Level, Input, InputGroup, Select, Alert, Segment, Button } from '@/components';

import { Polygon } from '@/data/polygons';

import { renderIf } from '@/utils';

// step point 
import { pointStep } from '@/data';

export default class NewAddressModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.validator = new Validator({
			name: 'required',
			penerima: 'required',
			no_hp: 'required|min:6|max:14|regex:^([0-9]+)$',
			provinsi: 'required',
			kecamatan: 'required',
			kodepos: 'required',
			address: 'required',
			id: 'min:1',
			isEdit: 'min:1',
			longitude: 'min:1',
			latitude: 'min:1'
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
				isEdit: this.props.formDataAddress.isEdit || false,
				latitude: this.props.formDataAddress.latitude || null,
				longitude: this.props.formDataAddress.longitude || null,
			},
			errors: this.validator.errorBag,
			district: {},
			gosendData: {
				center: {
					lat: this.props.formDataAddress.latitude,
					lng: this.props.formDataAddress.longitude,
				},
				location_coords: null,
				stepPoint: pointStep.pointHide
			}, 
			formattedAddress: '',
			isCustomerData: false
		};
		this.onChange = this.onChange.bind(this);
		this.onChangeSelect = this.onChangeSelect.bind(this);
		this.onSubmitAddress = this.onSubmitAddress.bind(this);
		this.onGeoLoad = this.onGeoLoad.bind(this);
		this.validateAndSubmit = this.validateAndSubmit.bind(this);
		this.getDistricts = this.getDistricts.bind(this);
		this.onChangePoint = this.onChangePoint.bind(this);
		this.kecamatan = null;
		this.onClose = this.onClose.bind(this);
	}

	componentWillMount() {
		const la = this.props.formDataAddress.latitude || '';
		const lo = this.props.formDataAddress.longitude || '';
		
		if (la !== '' && lo !== '') {
			const gosendData = this.state.gosendData;
			this.setState({
				gosendData: {
					...gosendData,
					stepPoint: pointStep.showPointAddress
				}, 
				isCustomerData: true
			});
		}		
	}

	onChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setErrors(name, value);
	}

	onChangeSelect(e) {
		this.gosendCheck(e);
		this.setErrors(e.name, e.value);
	}

	onSubmitAddress(formData) {
		this.props.onSubmitAddress(formData);
	}

	onGeoLoad(lat, long, formattedAddress) {
		const formData = this.state.formData;
		const gosendData = this.state.gosendData;
		this.setState({
			formattedAddress, 
			cityProvGosend: false, 
			districtGosend: true,
			isPinPoint: true, 
			formData: {
				...formData,
				longitude: long.toString(), 
				latitude: lat.toString()
			},
			gosendData: {
				...gosendData,
				stepPoint: pointStep.pinPoined
			}
		});
	}
	onChangePoint() {
		const kecamatan = this.props.formDataAddress.kecamatan || this.state.formData.kecamatan;
		const PolygonResult = this.getPolygonData(kecamatan.toLowerCase());
		const gosendData = this.state.gosendData;
		const center = PolygonResult.center;
		const locationCoords = PolygonResult.location_coords;
		this.setState({
			gosendData: {
				...gosendData,
				center,
				location_coords: locationCoords,
				stepPoint: pointStep.pinPoint
			}
		});
	}

	onClose(event) {
		this.props.closeModalShippingAddress(event);
	}

	getPolygonData(kecamatan) {
		this.kecamatan = kecamatan;
		const district = this.kecamatan.toLowerCase().replace(/\W+(.)/g, (match, chr) => {
			return chr.toUpperCase();
		});
			
		const data = Polygon.map((option) => {
			return option[district] ? option : null;
		}).filter((option) => {
			return option;
		});
		
		return data[0][district];
		
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

	gosendCheck(e) {
		if (e.name === 'provinsi') {
			this.getDistricts(e.value);
			const enableGosend = e.label.toLowerCase().includes('jakarta');
			this.setState({
				enableGosend
			});
		}
		
		if (e.name === 'kecamatan') {
			const PolygonResult = this.getPolygonData(e.value.toLowerCase());
			
			const gosendData = this.state.gosendData;
			this.setState({
				gosendData: {
					...gosendData,
					stepPoint: pointStep.pinPoint,
					center: PolygonResult.center,
					location_coords: PolygonResult.location_coords
				}
			});
			// }	
		}
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
			isCustomerData
		} = this.state;
		return (
			<Modal size='medium' shown={this.props.shown} onClose={this.onClose} >
				<Modal.Header>
					<div>{ this.props.formDataAddress.isEdit ? 'Ubah Alamat' : 'Buat Alamat Baru'}</div>
				</Modal.Header>
				<Modal.Body>
					<div className={styles.overflow} ref={(overflow) => { this.fieldOverflow = overflow; }}>
						<InputGroup>
							<Input 
								label='Simpan Sebagai *' 
								horizontal
								onChange={this.onChange}
								placeholder='Contoh: rumah, kantor, rumah pacar'
								name='name'
								color={errors.has('name') ? 'red' : null}
								message={errors.has('name') ? 'Name field is required.' : ''}
								type='text'
								value={typeof this.props.formDataAddress.label !== 'undefined' ? this.props.formDataAddress.label : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Input 
								label='Nama Penerima *'
								horizontal
								onChange={this.onChange}
								placeholder='Masukan nama lengkap penerima'
								name='penerima'
								color={errors.has('penerima') ? 'red' : null}
								message={errors.has('penerima') ? 'Penerima field is required.' : ''}
								type='text'
								value={typeof this.props.formDataAddress.nama !== 'undefined' ? this.props.formDataAddress.nama : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Input 
								label='No Handphone *'
								horizontal
								onChange={this.onChange}
								placeholder='Contoh : 08123456789'
								name='no_hp'
								color={errors.has('no_hp') ? 'red' : null}
								message={errors.first('no_hp')}
								type='number'
								value={typeof this.props.formDataAddress.noHP !== 'undefined' ? this.props.formDataAddress.noHP : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Select 
								horizontal
								label='Kota, Provinsi *'
								filter
								name='provinsi'
								selectedLabel={typeof this.props.formDataAddress.kotProv !== 'undefined' ? this.props.formDataAddress.kotProv : '-- Silakan Pilih'} 
								onChange={this.onChangeSelect}
								color={errors.has('provinsi') ? 'red' : null}
								message={errors.has('provinsi') ? 'Provinsi field is required.' : ''}
								options={this.props.cityProv || []} 
							/>
						</InputGroup>
						{
							renderIf(this.props.district)(
								<InputGroup>
									<Select 
										horizontal
										label='Kecamatan *'
										name='kecamatan' 
										filter
										selectedLabel={typeof this.props.formDataAddress.kecamatan !== 'undefined' ? this.props.formDataAddress.kecamatan : '-- Silakan Pilih'} 
										onChange={this.onChangeSelect}
										color={errors.has('kecamatan') ? 'red' : null}
										message={errors.has('kecamatan') ? 'Kecamatan field is required.' : ''}
										options={this.props.district || []} 
									/>
								</InputGroup>
							)
						}
						<InputGroup>
							<Input 
								label='Kode Pos *'
								horizontal
								placeholder='Contoh : 12345'
								name='kodepos'
								type='number'
								onChange={this.onChange}
								color={errors.has('kodepos') ? 'red' : null}
								message={errors.first('kodepos')}
								value={typeof this.props.formDataAddress.kodepos !== 'undefined' ? this.props.formDataAddress.kodepos : ''}
							/>
						</InputGroup>
						<InputGroup>
							<Textarea 
								horizontal
								label='Alamat *'
								placeholder='Masukkan Alamat Lengkap'
								name='address'
								onChange={this.onChange}
								color={errors.has('address') ? 'red' : null}
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
							renderIf(gosendData.stepPoint === pointStep.pinPoint)(
								<Gosend
									zoom={15} 
									center={gosendData.center} 
									polygonArea={gosendData.location_coords} 
									onGeoLoad={this.onGeoLoad}
									isCustomerData={isCustomerData}
								/>
							)
						}
						{
							renderIf(gosendData.stepPoint === pointStep.showPointAddress || gosendData.stepPoint === pointStep.pinPoined)(
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
												<button onClick={this.onChangePoint} className='font-small font-orange'>Ganti Lokasi</button>
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