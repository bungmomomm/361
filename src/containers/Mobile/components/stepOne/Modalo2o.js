import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { 
	Modal, 
	Input,
	Card,
	Select
} from '@/components';

import { Address } from '@/data';

class Modalo2o extends Component {
	
	static fetchDataO2OProvinces(token, dispatch) {
		dispatch(new actions.getO2OProvinces(token));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selected: ''
		};
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillMount() {
		if (this.props.o2oProvinces === undefined) {
			this.constructor.fetchDataO2OProvinces(this.cookies, this.props.dispatch);
		}
	}

	handleChooseElocker(elockerId) {
		this.setState({
			selected: elockerId
		});
	}
	
	render() {
		return (
			<Modal size='medium' close {...this.props}>
				<Modal.Header>
					<Select
						filter
						name='provinsi'
						options={this.props.o2oProvinces} 
					/>
				</Modal.Header>
				<Modal.Header>
					<Input placeholder='Cari Lokasi Toko / E-Locker (O2O) lainnya' />
				</Modal.Header>
				<Modal.Body>
					{
						Address.map((elocker, index) => (
							<Card key={index} radius selected={this.state.selected === elocker.value} onClick={() => this.handleChooseElocker(elocker.value)}>
								<Card.Title>E-Locker Family Mart Panglima Polim</Card.Title>
								<p>Jl. Panglima Polim Raya No.86
								Kenayoran Baru, Jakarta Selatan 12160
								Telp: </p>
							</Card>
						))
					}
				</Modal.Body>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		o2oProvinces: state.addresses.o2oProvinces,
		listo2o: state.addresses.o2o
	};
};

export default withCookies(connect(mapStateToProps)(Modalo2o));