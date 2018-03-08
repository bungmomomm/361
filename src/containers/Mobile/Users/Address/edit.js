import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Page, Svg, Button, Header, Select, Level } from '@/components/mobile';
import { actions } from '@/state/v4/Address';
import styles from './style.scss';
import { Form, Input } from '@/components/mobile/Formsy';
import { to } from 'await-to-js';
import { Promise } from 'es6-promise';

class Address extends Component {

	state = {
		allowSubmit: false,
		showSelect: {
			province: false,
			district: false
		},
		disabled: {
			province: false,
			district: true
		},
		selected: {
			province: '',
			district: ''
		},
		type: 'shipping',
		submitting: false
	};

	onChange = (v, which = 'province') => {
		this.setState({
			selected: {
				...this.state.selected,
				[which]: v
			}
		});

		if (which === 'province') {

			this.setState({
				disabled: {
					...this.state.disabled,
					district: true
				},
				selected: {
					...this.state.selected,
					district: ''
				}
			});

			if (v) {
				(async () => {
					const { dispatch, cookies } = this.props;
					const [err, resp] = await to(dispatch(actions.getDistrict({
						token: cookies.get('user.token'),
						query: {
							offset: 30,
							province_id: v
						}
					})));

					if (err) {
						return Promise.reject(err);
					}

					this.setState({
						disabled: {
							...this.state.disabled,
							district: false
						}
					});

					return Promise.resolve(resp);
				})();
			}
		}
	};

	onSubmit = () => {
		this.formsy.submit();
	};

	toggleShow = (which = 'province') => {
		this.setState({
			showSelect: {
				...this.state.showSelect,
				[which]: !this.state.showSelect[which]
			}
		});
	};

	disableButton = () => {
		this.setState({ allowSubmit: false });
	};

	enableButton = () => {
		this.setState({ allowSubmit: true });
	};

	submit = async (model) => {
		model = {
			...model,
			type: this.state.type,
			country_id: 1,
			is_supported_pin_point: 0,
			latitude: '',
			longitude: ''
		};

		const { dispatch, cookies, history } = this.props;
		this.setState({ submitting: true });
		await dispatch(actions.addAddress(cookies.get('user.token'), model));

		history.push('/address');
	};

	renderData = () => {
		const { address } = this.props;
		const provinces = address.options.provinces;
		const districts = address.options.districts;

		const selected = {
			province: provinces.filter((obj) => {
				return obj.value === this.state.selected.province;
			}),
			district: districts.filter((obj) => {
				return obj.value === this.state.selected.district;
			})
		};

		return (
			<Page>
				<Form
					style={{ padding: '15px' }}
					onValidSubmit={this.submit}
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					ref={(form) => { this.formsy = form; }}
				>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='default_address'>Jadikan Alamat Utama</label>
						<Input
							type='radio'
							name='default_address[]'
							value={0}
						/> Tidak
						<Input
							type='radio'
							name='default_address[]'
							value={1}
						/> Ya
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='address_label'>Simpan Sebagai</label>
						<Input
							id='address_label'
							name='address_label'
							flat
							placeholder='Rumah'
							validations={{
								matchRegexp: /^[0-9A-Za-z,.\s]+$/
							}}
							validationError='Invalid character supplied'
							disabled={this.state.submitting}
							required
							hint='This is hint'
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='fullname'>Nama Penerima</label>
						<Input
							id='fullname'
							name='fullname'
							flat
							placeholder='John Doe'
							validations='isWords'
							validationError='Invalid character supplied'
							disabled={this.state.submitting}
							required
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='telephone'>Nomor Handphone</label>
						<Input
							id='phone'
							name='phone'
							flat
							placeholder='085975049209'
							validations={{
								matchRegexp: /^[0-9]{7,14}$/
							}}
							validationError='Invalid character supplied'
							disabled={this.state.submitting}
							required
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='province'>Kota, Provinsi</label>
						<Level
							className='flex-row border-bottom'
							onClick={
								(this.state.disabled.province || this.state.submitting) ? false : () => this.toggleShow()
							}
						>
							<Level.Left>
								<Button className='flex-center' disabled={(this.state.disabled.province || this.state.submitting)}>
									<span style={{ marginRight: '10px' }}>
										{selected.province.length ? selected.province[0].label : '- Select Province -'}
									</span>
								</Button>
							</Level.Left>
							<Level.Right>
								<Svg src='ico_chevron-down.svg' />
							</Level.Right>
						</Level>
						<Select
							horizontal
							show={this.state.showSelect.province}
							label='Kota, Provinsi *'
							name='province'
							options={provinces}
							onChange={this.onChange}
							onClose={() => this.toggleShow('province')}
							defaultValue={selected.province.length ? selected.province[0].value : ''}
						/>
						<Input
							id='province_id'
							name='province_id'
							type='hidden'
							validations={{
								matchRegexp: /^[1-9]+$/
							}}
							validationError='This field is required'
							value={this.state.selected.province}
							required
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='district'>Kecamatan</label>
						<Level
							className='flex-row border-bottom'
							onClick={
								(this.state.disabled.district || this.state.submitting) ? false : () => this.toggleShow('district')
							}
						>
							<Level.Left>
								<Button className='flex-center' disabled={(this.state.disabled.district || this.state.submitting)}>
									<span style={{ marginRight: '10px' }}>
										{selected.district.length ? selected.district[0].label : '- Select District -'}
									</span>
								</Button>
							</Level.Left>
							<Level.Right>
								<Svg src='ico_chevron-down.svg' />
							</Level.Right>
						</Level>
						<Select
							horizontal
							show={this.state.showSelect.district}
							label='Kecamatan *'
							name='district'
							options={districts}
							onChange={(v) => this.onChange(v, 'district')}
							onClose={() => this.toggleShow('district')}
							defaultValue={selected.district.length ? selected.district[0].value : ''}
						/>
						<Input
							id='district_id'
							name='district_id'
							type='hidden'
							validations={{
								matchRegexp: /^[1-9]+$/
							}}
							validationError='This field is required'
							value={this.state.selected.district}
							required
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='zipcode'>Kode Pos</label>
						<Input
							id='zipcode'
							name='zipcode'
							flat
							placeholder='16451'
							validations={{
								matchRegexp: /^[0-9]{5,6}$/
							}}
							validationError='Invalid character supplied'
							disabled={this.state.submitting}
							required
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='address'>Address</label>
						<Input
							id='address'
							name='address'
							flat
							placeholder='Jl. Perbanas No. 5A - Tugu'
							validationError='This field is required'
							disabled={this.state.submitting}
							required
						/>
					</div>
				</Form>
			</Page>
		);
	};

	render() {
		const { history } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: 'Alamat Baru',
			right: (
				<Button onClick={this.onSubmit} disabled={(!this.state.allowSubmit || this.state.submitting)}>
					SIMPAN
				</Button>
			)
		};

		return (
			<div>
				{this.renderData()}
				<Header.Modal {...HeaderPage} />
			</div>
		);
	};
};

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	const { dispatch, cookies, history } = props;
	if (!cookies.get('isLogin')) {
		history.push('/login');
	}

	dispatch(actions.initAddress(cookies.get('user.token')));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous)));
