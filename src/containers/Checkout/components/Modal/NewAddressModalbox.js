import React, { Component } from 'react';
import styles from '../../Checkout.scss';
import { Validator } from 'ree-validate';

// component load
import { Gosend, Icon, Textarea, Modal, Level, Input, InputGroup, Select, Alert, Segment, Button } from '@/components';

// Dummy Data
import { Provinsi } from '@/data';

export default class NewAddressModalbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.validator = new Validator({
			name: 'required',
			penerima: 'required',
			no_hp: 'required',
			provinsi: 'required',
			kecamatan: 'required',
			kodepos: 'required',
			address: 'required'
		});

		this.state = {
			formData: {
				name: '',
				penerima: '',
				no_hp: '',
				provinsi: '',
				kecamatan: '',
				kodepos: '',
				address: ''
			},
			errors: this.validator.errorBag,
		};
		this.onChange = this.onChange.bind(this);
		this.onChangeSelect = this.onChangeSelect.bind(this);
		this.validateAndSubmit = this.validateAndSubmit.bind(this);
	}

	componentWillReceiveProps() {
		console.log(this.props);
	}

	onChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setErrors(name, value);
	}

	onChangeSelect(e) {
		this.setErrors(e.name, e.value);
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
		console.log(this.state);
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
		const { errors } = this.state;
		return (
			<Modal shown={this.props.shown}>
				<Modal.Header>
					<div>Buat Alamat Baru</div>
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
								selectedLabel={typeof this.props.formDataAddress.kotProv !== 'undefined' ? this.props.formDataAddress.kotProv : '-- Silahkan Pilih'} 
								onChange={this.onChangeSelect}
								error={errors.has('provinsi')}
								message={errors.has('provinsi') ? 'Provinsi field is required.' : ''}
								options={Provinsi} 
							/>
						</InputGroup>
						<InputGroup>
							<Select 
								horizontal
								label='Kecamatan'
								filter
								required
								selectedLabel={typeof this.props.formDataAddress.kecamatan !== 'undefined' ? this.props.formDataAddress.kecamatan : '-- Silahkan Pilih'} 
								onChange={this.onChangeSelect}
								error={errors.has('kecamatan')}
								message={errors.has('kecamatan') ? 'Kecamatan field is required.' : ''}
								options={Provinsi} 
							/>
						</InputGroup>
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
						<Gosend 
							zoom={15} 
							center={{ 
								lat: -6.164118, 
								lng: 106.821247
							}} 
						/>
						<Segment row>
							<Level padded>
								<Level.Item>
									<Icon name='map-marker' />
								</Level.Item>
								<Level.Item>
									Jalan Bangka II No.20, Pela Mampang, 
									Mampang Prapatan, Kota Jakarta Selatan, 
									DKI jakarta 12720
								</Level.Item>
								<Level.Item>
									<button className='font-small font-orange'>Ganti Lokasi</button>
								</Level.Item>
							</Level>
						</Segment>
						<p className='font-small font-orange'>Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.</p>
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