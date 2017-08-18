import React, { Component } from 'react';

// component load
import { Modal } from '@/components/Base';
import Elocker from '@/components/Elocker';

export default class ElockerModalBox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			listo2o: null,
			filtero2o: null,
			province: {
				label: 'DKI JAKARTA',
				value: 6
			}
		};
		this.onSelectedLocker = this.onSelectedLocker.bind(this);
		this.setFilterLocker = this.setFilterLocker.bind(this);
		this.onGetListO2o = this.onGetListO2o.bind(this);
		this.setCurrentProvince = this.setCurrentProvince.bind(this);
	}

	onSelectedLocker(elocker) {
		this.props.onSelectedLocker(elocker, true);
	}

	onGetListO2o(listo2o) {
		this.setState({
			filtero2o: null,
		});
		this.props.onGetListO2o(listo2o);
	}

	setFilterLocker(listo2o) {
		this.setState({
			filtero2o: listo2o,
		});
	}

	setCurrentProvince(province) {
		this.setState({
			province
		});
	}

	render() {
		return (
			<Modal large shown={this.props.shown} >
				<Modal.Header>
					Pilih Lokasi E-Locker (O2O)
				</Modal.Header>
				<Modal.Body>
					<Elocker o2oProvinces={this.props.o2oProvinces} listo2o={this.props.listo2o} filtero2o={this.state.filtero2o ? this.state.filtero2o : this.props.listo2o} onGetListO2o={this.onGetListO2o} onSelectedLocker={this.onSelectedLocker} setFilterLocker={this.setFilterLocker} currentProvince={this.state.province} setCurrentProvince={this.setCurrentProvince} />
				</Modal.Body>
			</Modal>
		);
	}
}
