import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { 
	Modal, 
	Input,
	Panel,
	Radio,
	Select
} from 'mm-ui';
import { T } from '@/data/translations';
import styles from './modalo2o.scss';

class Modalo2o extends Component {
	
	static fetchDataO2OProvinces(token, dispatch) {
		dispatch(new actions.getO2OProvinces(token));
	}

	static fetchDataO2OList(token, dispatch, provinceId, query = null) {
		dispatch(new actions.getO2OList(token, 1000, provinceId, query));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedProvince: this.props.selectedProvinceO2O || '6',
			listo2o: this.props.listo2o,
			collections: this.props.listo2o || [],
			filter: ''			
		};
		this.cookies = this.props.cookies.get('user.token');
		this.onSelectProvince = this.onSelectProvince.bind(this);
		this.onChangeFilterText = this.onChangeFilterText.bind(this);
		this.onLoadData = this.onLoadData.bind(this);
		this.timeout = null;
	}

	componentWillMount() {
		if (this.props.o2oProvinces === undefined) {
			this.constructor.fetchDataO2OProvinces(this.cookies, this.props.dispatch);		
		}
		this.onLoadData(this.props.selectedProvinceO2O || this.state.selectedProvince);
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.listo2o !== nextProps.listo2o) {
			if (typeof nextProps.listo2o === 'object' && nextProps.listo2o.length > 0) {
				const newo2oLocation = this.state.collections;
				newo2oLocation.push(...nextProps.listo2o);
				this.setState({
					listo2o: nextProps.listo2o,
					collections: newo2oLocation
				});
			}
		}
	}

	onLoadData(provinceId) {
		this.constructor.fetchDataO2OList(this.cookies, this.props.dispatch, provinceId);
	}

	onSelectProvince(event) {
		this.onLoadData(event.value);
		this.setState({
			selectedProvince: event.value,
			filter: ''
		});
	}

	onChangeFilterText(event) {
		const filter = event.target.value;
		if (this.props.collections && filter !== '') {
			const listo2o = this.state.collections.map((item) => {
				const filterLabel = item.attributes.address_label;
				const isFilteredByLabel = filterLabel && (filterLabel.toUpperCase().indexOf(filter.toUpperCase()) > -1);
				const filterAddress = item.attributes.address;
				const isFilteredByAddress = filterAddress && (filterAddress.toLowerCase().indexOf(filter.toLowerCase()) > -1);
				return (isFilteredByLabel || isFilteredByAddress) ? item : null;
			}).filter((item) => {
				return item;
			});
			if (listo2o.length < 1) {
				if (this.timeout) {
					clearTimeout(this.timeout);
					this.timeout = null;
				}
				this.timeout = setTimeout(() => {
					this.constructor.fetchDataO2OList(this.cookies, this.props.dispatch, this.state.selectedProvince, filter);
				}, 1000);
			}
			this.setState({
				listo2o,
				filter
			});
		} else {
			this.setState({
				listo2o: this.state.collections,
				filter
			});		
		}
	}

	handleChooseElocker(elockerId) {
		this.setState({
			selected: elockerId
		});
	}
	
	render() {
		return (
			<Modal
				size='medium' 
				className={styles.modal}
				showOverlayCloseButton
				show={this.props.open}
				onCloseRequest={this.props.handleClose}
			>
				<Modal.Header>
					<div className={styles.header}>
						{
							this.props.o2oProvinces &&
							<div className={styles.searchFilter}><Select hasFilter options={this.props.o2oProvinces} block onChange={this.onSelectProvince} defaultValue={this.state.selectedProvince} /></div>
						}
						<div className={styles.searchInput}>
							<Input 
								block 
								dataProps={{
									value: this.state.filter
								}}
								placeholder='Cari Lokasi Toko / E-Locker (O2O) lainnya' 
								onChange={this.onChangeFilterText} 
							/>
						</div>
					</div>
				</Modal.Header>
				<Modal.Body className={styles.body}>
					{
						this.state.listo2o && this.state.listo2o.filter(e => e.type === 'pickup_location').map((address, index) => {
							const isChecked = this.props.selectedAddressO2O && this.props.selectedAddressO2O.id === address.id;
							return (
								<Panel 
									key={index} 
									className={styles.panel}
									color={isChecked ? 'yellow' : 'grey'}
									onClick={() => this.props.onChange(address, this.state.selectedProvince)}
									header={
										<Radio 
											inverted={isChecked}
											data={[
												{ 
													label: isChecked ? T.checkout.MAIN_ADDRESS : T.checkout.USE_THIS_ADDRESS, 
													inputProps: { 
														readOnly: true,
														checked: isChecked
													} 
												}
											]} 
										/>
									}
								>
									<div>
										<p><strong>{address.attributes.address_label}</strong></p>
										<p>{address.attributes.address}</p>
									</div>
								</Panel>
							);
						})
					}
				</Modal.Body>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		o2oProvinces: state.addresses.o2oProvinces,
		listo2o: state.addresses.o2o,
	};
};

export default withCookies(connect(mapStateToProps)(Modalo2o));