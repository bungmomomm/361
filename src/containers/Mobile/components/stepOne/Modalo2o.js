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

class Modalo2o extends Component {
	
	static fetchDataO2OProvinces(token, dispatch) {
		dispatch(new actions.getO2OProvinces(token));
	}

	static fetchDataO2OList(token, dispatch, provinceId) {
		dispatch(new actions.getO2OList(token, 1000, provinceId));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedProvince: this.props.selectedProvinceO2O || '6',
			listo2o: this.props.listo2o			
		};
		this.cookies = this.props.cookies.get('user.token');
		this.onSelectProvince = this.onSelectProvince.bind(this);
		this.onChangeFilterText = this.onChangeFilterText.bind(this);
		this.onLoadData = this.onLoadData.bind(this);
	}

	componentWillMount() {
		if (this.props.o2oProvinces === undefined) {
			this.constructor.fetchDataO2OProvinces(this.cookies, this.props.dispatch);		
		}
		this.onLoadData(this.props.selectedProvinceO2O || this.state.selectedProvince);
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.listo2o !== nextProps.listo2o) {
			this.setState({
				listo2o: nextProps.listo2o
			});
		}
	}

	onLoadData(provinceId) {
		this.constructor.fetchDataO2OList(this.cookies, this.props.dispatch, provinceId);
	}

	onSelectProvince(event) {
		this.onLoadData(event.value);
		this.setState({
			selectedProvince: event.value
		});
	}

	onChangeFilterText(event) {
		const filter = event.target.value;
		const listo2o = this.props.listo2o.map((item) => {
			const filterLabel = item.attributes.address_label;
			const isFilteredByLabel = filterLabel && (filterLabel.toUpperCase().indexOf(filter.toUpperCase()) > -1);
			const filterAddress = item.attributes.address;
			const isFilteredByAddress = filterAddress && (filterAddress.toLowerCase().indexOf(filter.toLowerCase()) > -1);
			return (isFilteredByLabel || isFilteredByAddress) ? item : null;
		}).filter((item) => {
			return item;
		});
		this.setState({
			listo2o
		});
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
				showOverlayCloseButton
				show={this.props.open}
				onCloseRequest={this.props.handleClose}
			>
				<Modal.Header>
					{
						this.props.o2oProvinces &&
						<Select hasFilter options={this.props.o2oProvinces} onChange={this.onSelectProvince} defaultValue={this.state.selectedProvince} style={{ paddingRight: '30px' }} />
					}
					<Input block placeholder='Cari Lokasi Toko / E-Locker (O2O) lainnya' onChange={this.onChangeFilterText} />
				</Modal.Header>
				<Modal.Body>
					{
						this.state.listo2o && this.state.listo2o.map((address, index) => {
							const isChecked = this.props.selectedAddressO2O && this.props.selectedAddressO2O.id === address.id;
							return (
								<Panel 
									key={index} 
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