import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { 
	Modal, 
	Input,
	Message,
	Radio,
	Select
} from 'mm-ui';

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
			<Modal 
				size='medium' 
				showOverlayCloseButton
				show={this.props.open}
				onCloseRequest={this.props.handleClose}
			>
				<Modal.Header>
					<Select options={this.props.o2oProvinces} style={{ paddingRight: '30px' }} />
					<Input block placeholder='Cari Lokasi Toko / E-Locker (O2O) lainnya' />
				</Modal.Header>
				<Modal.Body>
					{
						Address.map((address, index) => {
							const isChecked = false;
							return (
								<Message 
									key={index} 
									color={isChecked ? 'yellow' : 'grey'}
									onClick={() => this.props.onChange(address)}
									header={
										<Radio 
											inverted={isChecked}
											data={[
												{ 
													label: isChecked ? 'Alamat Utama' : 'Gunakan Alamat ini', 
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
										<p><strong>E-Locker Family Mart Panglima Polim</strong></p>
										<p>Jl. Panglima Polim Raya No.86
										Kenayoran Baru, Jakarta Selatan 12160
										Telp: </p>
									</div>
								</Message>
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
		listo2o: state.addresses.o2o
	};
};

export default withCookies(connect(mapStateToProps)(Modalo2o));