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
import _ from 'lodash';
import { isLogin, userToken } from '@/data/cookiesLabel';
import Switch from 'react-switch';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Address extends Component {

	state = {
		allowSubmit: false,
		showSelect: {
			city: false,
			district: false
		},
		disabled: {
			city: false,
			district: false
		},
		selected: {
			city: '',
			district: ''
		},
		type: 'shipping',
		submitting: false,
		default: false,
		edit: {}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.address.edit !== nextProps.address.edit) {
			(async () => {
				const { dispatch, cookies, address, address: { edit } } = nextProps;
				const selected = { city: [], district: [] };

				const cities = await to(dispatch(actions.getCity(cookies.get(userToken), { q: `${edit.city.split(' ').pop().replace(/[,.]/i, '')}` })));
				selected.city = cities[1] ? cities[1].data.data.cities.filter((obj) => {
					return obj.name === `${edit.city}, ${edit.province}`;
				}) : [];

				if (selected.city.length) {
					const districts = await to(dispatch(actions.getDistrict(cookies.get(userToken), { city_id: selected.city[0].city_id })));
					selected.district = districts[1] ? districts[1].data.data.districts.filter((obj) => {
						return obj.name === edit.district;
					}) : [];
				}

				this.setState({
					...this.state,
					edit: address.edit,
					selected: {
						city: selected.city.length ? `${selected.city[0].province_id}_${selected.city[0].city_id}` : '',
						district: selected.district.length ? selected.district[0].id : '',
					},
					default: edit.fg_default === 1
				});

			})();
		}
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(actions.mutateState({ edit: {} }));
	}

	onSelectChange = (v, which = 'city') => {
		this.setState({
			selected: {
				...this.state.selected,
				[which]: v
			}
		});

		if (which === 'city') {
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
					const resp = await to(dispatch(actions.getDistrict(cookies.get(userToken), { city_id: v.split('_')[1] })));

					this.setState({
						disabled: {
							...this.state.disabled,
							district: false
						}
					});

					return Promise.resolve(resp[1]);
				})();
			}
		}
	};

	onTextChange = (e) => {
		this.setState({
			edit: {
				...this.state.edit,
				[e.currentTarget.name]: e.currentTarget.value
			}
		});
	};

	onSubmit = () => {
		this.formsy.submit();
	};

	onCitySearch = (el) => {
		const { cookies, dispatch } = this.props;
		if (el.target.value.length > 2) {
			dispatch(actions.getCity(cookies.get(userToken), { q: el.target.value }));
		}
	};

	toggleShow = (which = 'city') => {
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

	radioChange = (v) => {
		this.setState({ default: v });
	};

	submit = async (model) => {
		const { city_id } = model;
		const splitr = city_id.split('_');

		model = {
			...model,
			province_id: splitr[0],
			city_id: splitr[1],
			type: this.state.type,
			country_id: 1,
			latitude: '',
			longitude: '',
			default: this.state.default,
			address_id: this.state.edit.id
		};

		const { dispatch, cookies, history } = this.props;
		this.setState({ submitting: true });
		await dispatch(actions.editAddress(cookies.get(userToken), model));

		history.push('/address');
	};

	renderData = () => {
		const { address } = this.props;
		const cities = address.options.cities;
		const districts = address.options.districts;

		const selected = {
			city: cities.filter((obj) => {
				return obj.value === this.state.selected.city;
			}),
			district: districts.filter((obj) => {
				return obj.value === this.state.selected.district;
			})
		};

		return (
			<Page color='grey'>
				<Form
					onValidSubmit={this.submit}
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					ref={(form) => { this.formsy = form; }}
				>
					<Level className='padding--medium margin--medium-b bg--white'>
						<Level.Left>
							<div className='padding--small-t'>
								<span>Jadikan Alamat Utama</span>
							</div>
						</Level.Left>
						<Level.Right>
							<div>
								<Switch
									onChange={this.radioChange}
									checked={this.state.default}
									name='default_address'
									id='default_address'
									checkedIcon={false}
									uncheckedIcon={false}
									offColor={'#d8d8d8'}
									onColor={'#191919'}
								/>
							</div>
						</Level.Right>
					</Level>
					<Level className='bg--white flex-column'>
						<div className='padding--medium-v'>
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
								value={this.state.edit.address_label || ''}
								onChange={this.onTextChange}
							/>
						</div>
						<div className='padding--medium-v'>
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
								value={this.state.edit.fullname || ''}
								onChange={this.onTextChange}
							/>
						</div>
						<div className='padding--medium-v'>
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
								value={this.state.edit.phone || ''}
								onChange={this.onTextChange}
							/>
						</div>
						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='city'>Kota, Provinsi *</label>
							<Level
								className='flex-row border-bottom'
								onClick={
									(this.state.disabled.city || this.state.submitting) ? false : () => this.toggleShow()
								}
							>
								<Level.Left>
									<Button className='flex-center' disabled={(this.state.disabled.city || this.state.submitting)}>
										<span style={{ marginRight: '10px' }}>
											{selected.city.length ? selected.city[0].label : '- Select City -'}
										</span>
									</Button>
								</Level.Left>
								<Level.Right>
									<Svg src='ico_chevron-down.svg' />
								</Level.Right>
							</Level>
							<Select
								horizontal
								show={this.state.showSelect.city}
								label='Kota, Provinsi *'
								name='city'
								options={cities}
								search
								onSearch={this.onCitySearch}
								onChange={this.onSelectChange}
								onClose={() => this.toggleShow()}
								defaultValue={selected.city.length ? selected.city[0].value : ''}
							/>
							<Input
								id='city_id'
								name='city_id'
								type='hidden'
								validations={{
									matchRegexp: /^[1-9][0-9]*_[1-9][0-9]*$/
								}}
								validationError='This field is required'
								value={this.state.selected.city}
								required
							/>
						</div>

						<div className='padding--medium-v'>
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
								onChange={(v) => this.onSelectChange(v, 'district')}
								onClose={() => this.toggleShow('district')}
								defaultValue={selected.district.length ? selected.district[0].value : ''}
							/>
							<Input
								id='district_id'
								name='district_id'
								type='hidden'
								validations={{
									matchRegexp: /^[1-9][0-9]*$/
								}}
								validationError='This field is required'
								value={this.state.selected.district}
								required
							/>
						</div>

						<div className='padding--medium-v'>
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
								value={this.state.edit.zipcode || ''}
								onChange={this.onTextChange}
							/>
						</div>

						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='address'>Address</label>
							<Input
								id='address'
								name='address'
								flat
								placeholder='Jl. Perbanas No. 5A - Tugu'
								validationError='This field is required'
								disabled={this.state.submitting}
								required
								value={this.state.edit.address || ''}
								onChange={this.onTextChange}
							/>
						</div>
					</Level>
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
			center: 'Ubah Alamat',
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

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, history, match: { params } } = props;
	if (!cookies.get(isLogin) || cookies.get(isLogin) === 'false') {
		history.push('/login');
		return null;
	}

	const address = await dispatch(actions.getAddress(cookies.get(userToken)));
	const shipping = _.chain(address).get('data.data.shipping').value();

	if (!shipping) {
		return Promise.reject(new Error('Invalid, address not found.'));
	}

	const edit = shipping.filter((obj) => {
		return parseInt(obj.id, 10) === parseInt(params.id, 10);
	});

	if (!edit.length) {
		return Promise.reject(new Error('Invalid, address not found.'));
	}

	return dispatch(actions.mutateState({ edit: edit[0] }));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous)));
