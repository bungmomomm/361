import React, { Component } from 'react';
import { 
	Modal, 
	Input,
	Card,
	Select
} from '@/components';

import { Address, Provinsi } from '@/data';

class Modalo2o extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selected: ''
		};
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
						options={Provinsi} 
						selected={Provinsi[0]} 
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

export default Modalo2o;