import React, { Component } from 'react';
import styles from '../../Checkout.scss';
import { Validator } from 'ree-validate';

// component load
import { Gosend, Icon, Textarea, Modal, Level, Input, InputGroup, Select, Alert, Segment, Button } from '@/components';

import { Polygon } from '@/data/polygons';

import { renderIf } from '@/utils';

// step point 
// import { pointStep } from '@/data';

export default class NewAddressModalbox extends Component {
	static getPolygonData(kecamatan) {
		const district = kecamatan.toLowerCase().replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
		const data = Polygon.map((option) => {
			return option[district] ? option : null;
		}).filter((option) => {
			return option;
		});
		return data.length > 0 ? data[0][district] : null;
	}
	
	constructor(props) {
		super(props);
		this.props = props;
		this.validator = new Validator({
			name: 'required',
			penerima: 'required',
			no_hp: 'required|min:6|max:14|regex:^([0-9]+)$',
			provinsi: 'required',
			kecamatan: 'required',
			kodepos: 'required|min:5',
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
			
			displayMap: false,
			errors: this.validator.errorBag,
			district: {},
			rerenderMap: true,
			loading: false,
			pinPoint: '',
			isJakarta: false,
			enableGosend: false,
			kecamatanReset: false,
			renderDistrict: true,
			gosendData: {
				center: {
					lat: this.props.formDataAddress.latitude,
					lng: this.props.formDataAddress.longitude,
				},
				location_coords: null
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
		this.onClose = this.onClose.bind(this);
		this.gosendCheck = this.gosendCheck.bind(this);
		this.showGoogleMap = this.showGoogleMap.bind(this);
		this.hideGoogleMap = this.hideGoogleMap.bind(this);
		this.onSetPoint = this.onSetPoint.bind(this);
	}

	componentWillMount() {
		const la = this.props.formDataAddress.latitude || '';
		const lo = this.props.formDataAddress.longitude || '';
		if (la !== '' && lo !== '') {
			const gosendData = this.state.gosendData;
			const PolygonResult = this.constructor.getPolygonData(this.props.formDataAddress.kecamatan.toLowerCase());
			if (PolygonResult) {
				const locationCoords = PolygonResult.location_coords;
				this.setState({
					enableGosend: true,
					isJakarta: true,
					gosendData: {
						...gosendData,
						location_coords: locationCoords
					},
					isCustomerData: true
				});
			}

		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.district !== nextProps.district) {
			this.setState({
				loading: false
			});
		}
		if (nextProps.shown) {
			this.formAddressIsEdit(this.props.formDataAddress.isEdit);
			this.setState({
				shown: nextProps.shown
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
		if (this.state.formData.kecamatan !== '') {
			this.setState({
				formattedAddress,
				formData: {
					...formData
				},
				gosendData: {
					...gosendData
				}
			});
		}
	}

	onChangePoint() {
		this.setState({
			displayMap: true,
			pinPoint: 'showToggleButton'
		});
	}

	onClose(event) {
		this.props.closeModalShippingAddress(event);
	}
	
	onSetPoint(modalStatus, formattedAddress, location) {
		const formData = this.state.formData;
		this.setState({
			displayMap: !modalStatus,
			pinPoint: 'showAddress',
			formattedAddress,
			formData: {
				...formData,
				longitude: location.lng.toString(), 
				latitude: location.lat.toString()
			}
		});
	}

	getDistricts(cityProv) {
		if (cityProv !== '') {
			this.props.getDistricts(cityProv);
		}
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
	
	formAddressIsEdit(isEdit) {
		const { formDataAddress } = this.props;
		const gosendData = this.state.gosendData;
		this.state.errors.clear();
		this.setState({
			displayMap: false,
			kecamatanReset: false
		});
		if (isEdit) {
			const isJakarta = formDataAddress.kotProv.toLowerCase().includes('jakarta');
			const isCityNotJakarta = formDataAddress.kecamatan.toLowerCase() !== 'jakarta';
			if (isJakarta && isCityNotJakarta) {
				if (formDataAddress.latitude && formDataAddress.longitude) {
					const PolygonResult = this.constructor.getPolygonData(formDataAddress.kecamatan.toLowerCase());
					const locationCoords = PolygonResult.location_coords;
					this.setState({
						isJakarta: true,
						gosendData: {
							...gosendData,
							center: {
								lat: formDataAddress.latitude,
								lng: formDataAddress.longitude
							},
							location_coords: locationCoords,
						},
						pinPoint: 'showAddress',
						isCustomerData: true,
					});
				} else {
					this.setState({
						isJakarta: true,
						pinPoint: 'showToggleButton',
						isCustomerData: true,
						formData: {
							...this.state.formData,
							latitude: this.props.formDataAddress.latitude || null,
							longitude: this.props.formDataAddress.longitude || null
						},
					});
				}
			} else {
				this.setState({
					formattedAddress: '',
					isJakarta: false,
					pinPoint: 'showToggleButton',
					isCustomerData: true
				});
			}
		} else {
			this.setState({
				formattedAddress: '',
				pinPoint: 'hideAll',
				isJakarta: false,
				gosendData: {
					...gosendData,
					center: {},
					location_coords: []
				},
				isCustomerData: false
			});
		}
	}

	gosendCheck(e) {
		let isJakarta = false;
		if (this.selectProvince.state.selected.value) {
			isJakarta = this.selectProvince.state.selected.value.toLowerCase().includes('jakarta');
		}
		this.setState({
			loading: true
		});
		if (e.name === 'provinsi' && e.value !== null && e.value !== 0) {
			this.getDistricts(e.value);
			this.setState({
				isJakarta,
				kecamatanReset: true,
				loading: false,
				pinPoint: 'showToggleButton',
				renderDistrict: false
			});
			setTimeout(() => {
				this.setState({
					renderDistrict: true,
					formData: {
						...this.state.formData,
						kecamatan: '',
						latitude: null,
						longitude: null
					},
					formattedAddress: '',
				});
			}, 20);
		}
		setTimeout(() => {
			if (e.name === 'kecamatan' && isJakarta && e.value !== null && e.value !== 0) {
				const kecamatan = e.value;
				const PolygonResult = this.constructor.getPolygonData(kecamatan.toLowerCase());
				this.setState({
					isJakarta: !!PolygonResult,
					loading: false,
					pinPoint: PolygonResult ? 'showToggleButton' : 'hideAll',
					formData: {
						...this.state.formData,
						latitude: null,
						longitude: null
					},
				});
			} else {
				this.setState({
					loading: false,
					isJakarta: false,
					pinPoint: 'hideAll'
				});
			}
		}, 25);
	}

	submit(formData) {
		this.onSubmitAddress(formData);
	}

	validateAndSubmit(e) {
		e.preventDefault();
		const { formData } = this.state;
		console.log(formData);
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

	showGoogleMap() {
		this.setState({
			rerenderMap: false
		});
		const PolygonResult = this.constructor.getPolygonData(this.selectKecamatan.state.selected.value.toLowerCase());
		setTimeout(() => {
			this.setState({
				displayMap: true,
				rerenderMap: true,
				gosendData: {
					center: PolygonResult.center,
					location_coords: PolygonResult.location_coords
				}
			});
		}, 20);
	}
	
	hideGoogleMap() {
		this.setState({
			displayMap: false,
			gosendData: {
				center: {},
				location_coords: []
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
			<Modal size='medium' loading={this.state.loading} shown={this.props.shown} onClose={this.onClose} >
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
								value={this.props.formDataAddress.label || ''}
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
								value={this.props.formDataAddress.nama || ''}
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
								value={this.props.formDataAddress.noHP || ''}
							/>
						</InputGroup>
						{
							renderIf(this.props.cityProv)(
								<InputGroup>
									<Select 
										horizontal
										label='Kota, Provinsi *'
										filter
										name='provinsi'
										onChange={this.onChangeSelect}
										ref={(input) => { this.selectProvince = input; }}
										color={errors.has('provinsi') ? 'red' : null}
										message={errors.has('provinsi') ? 'Provinsi field is required.' : ''}
										options={this.props.cityProv || []} 
										selected={{
											label: this.props.formDataAddress.kotProv || '',
											value: this.props.formDataAddress.kotProv || ''
										}}
									/>
								</InputGroup>
							)
						}
						{
							renderIf(this.props.district && this.state.renderDistrict && !errors.has('provinsi'))(
								<InputGroup>
									<Select 
										horizontal
										label='Kecamatan *'
										name='kecamatan' 
										filter
										ref={(input) => { this.selectKecamatan = input; }}
										onChange={this.onChangeSelect}
										color={errors.has('kecamatan') ? 'red' : null}
										message={errors.has('kecamatan') ? 'Kecamatan field is required.' : ''}
										options={this.props.district || []}
										selected={{
											label: this.state.kecamatanReset ? '' : this.props.formDataAddress.kecamatan,
											value: this.state.kecamatanReset ? '' : this.props.formDataAddress.kecamatan
										}} 
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
								value={this.props.formDataAddress.kodepos || ''}
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
								value={this.props.formDataAddress.address || ''}
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
							renderIf(this.state.pinPoint === 'showToggleButton' && this.state.isJakarta && !this.state.displayMap)(
								<div className={styles.header}>
									<Button 
										type='button' 
										onClick={this.showGoogleMap} 
										content='Tunjukan Dalam Peta' 
										size='small' 
										color='grey' 
										icon='map-marker' 
										iconPosition='left' 
									/>
									<div className={styles.desc}>
										Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.
									</div>
								</div>
							)
						}{
							renderIf(this.state.pinPoint === 'showToggleButton' && this.state.isJakarta && this.state.displayMap)(
								<div className={styles.header}>
									<Button 
										type='button' 
										onClick={this.hideGoogleMap} 
										content='Batal' 
										size='small' 
										color='grey' 
										icon='times' 
										iconPosition='right' 
									/>
									<div className={styles.desc}>
										Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.
									</div>
								</div>
							)
						}
						
						{
							renderIf((gosendData.location_coords && gosendData.center) && this.state.isJakarta && this.state.rerenderMap)(
								<div>
									{
										<Gosend
											zoom={15} 
											center={gosendData.center} 
											polygonArea={gosendData.location_coords} 
											onGeoLoad={this.onGeoLoad}
											isCustomerData={isCustomerData}
											displayMap={this.state.displayMap}
											onSetPoint={this.onSetPoint}
										/>
									}
									{
										renderIf(this.state.formattedAddress && this.state.pinPoint === 'showAddress')(
											<div>
												<Segment row>
													<Level padded>
														<Level.Item>
															<Icon name='map-marker' />
														</Level.Item>
														<Level.Item>
															{this.state.formattedAddress}
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
							<Button disabled={this.state.errors.count() > 0} block type='button' onClick={this.validateAndSubmit} content='Simpan Alamat' color='dark' />
						</Level.Right>
					</Level>
				</Modal.Footer>
			</Modal>
		);
	}
};