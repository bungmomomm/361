import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Api';

import { 
	Segment,
	Container,
	Alert,
	Button,
	Card,
	InputGroup,
	Checkbox,
	Radio,
	CreditCardRadio,
	Input,
	CreditCardInput,
	Select
} from '@/components/Base';

import Stepper from '@/components/Stepper';

import { 
		// UangElektronik, 
		// GeraiTunai, 
		InternetBanking,
		Address
		// Bank
	} from '@/data';

class Home extends Component {
	static getDog(match, dispatch) {
		return dispatch(new actions.apiGet('/?format=json'));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			ip: {}
		};
	}

	componentWillMount() {
		this.constructor.getDog(null, this.props.dispatch);
	}

	render() {
		return (
			<Container>
				<Segment>
					Segment
				</Segment>
				<Alert show close color='red' align='left' icon='map-marker'>
					Alert
				</Alert>
				<Alert show close color='yellow' align='center' icon='map-marker'>
					Alert
				</Alert>
				<Alert show close color='green' align='right' icon='map-marker'>
					Alert
				</Alert>
				<InputGroup>
					<Button>
						button
					</Button>
					<Button color='red'>
						button
					</Button>
					<Button color='yellow'>
						button
					</Button>
					<Button color='green'>
						button
					</Button>
					<Button color='dark'>
						button
					</Button>
					<Button color='grey'>
						button
					</Button>
				</InputGroup>
				<InputGroup>
					<Card>
						<Card.Title>
							Card Title
						</Card.Title>
						Cart Content
					</Card>
				</InputGroup>
				<InputGroup>
					<Checkbox onClick={(value) => console.log(1)} name='checkbox' content='Checkbox Button' value='1' />
				</InputGroup>
				<InputGroup>
					<CreditCardRadio onClick={(value) => console.log('creditcardRadio 1')} name='creditcardRadio' content='18723681236123' value='1' />
					<CreditCardRadio onClick={(value) => console.log('creditcardRadio 2')} name='creditcardRadio' content='41111111111111' value='2' />
				</InputGroup>
				<InputGroup>
					<Radio name='radio' onClick={(value) => console.log(1)} content='Radio Button' value='1' />
					<Radio name='radio' onClick={(value) => console.log(2)} content='Radio Button' value='2' />
				</InputGroup>

				<InputGroup>
					<Input type='text' label='input label' size='medium' message='message area' icon='map-marker' placeholder='text input' />
				</InputGroup>
				<InputGroup>
					<Input type='text' label='input label' color='red' message='message area' placeholder='text input' />
				</InputGroup>
				<InputGroup>
					<Input type='text' label='input label' color='yellow' message='message area' placeholder='text input' />
				</InputGroup>
				<InputGroup>
					<Input type='text' label='input label' color='green' message='message area' placeholder='text input' />
				</InputGroup>
				<InputGroup>
					<CreditCardInput value='4111 1111 1111 1111' onChange={(data) => console.log(data)} size='medium' type='text' label='Credit Card Input' placeholder='Masukkan Nomor Kartu' />
				</InputGroup>
				<InputGroup addons>
					<Input size='small' name='voucherCode' color='green' value='' />
					<Button type='submit' size='small' color='green' content='CEK' />
				</InputGroup>
				<InputGroup addons>
					<Button type='submit' size='small' color='red' content='CEK' />
					<Input size='small' name='voucherCode' color='red' value='' />
				</InputGroup>
				<InputGroup>
					<Stepper value={1} maxValue={10} />
				</InputGroup>
				<InputGroup>
					<Select name='pembayaran' selectedLabel='-- Pilih Internet Banking' options={InternetBanking} />
				</InputGroup>
				<InputGroup>
					<Select 
						addButton={(
							<Button
								onClick={this.openModal}
								content='Ganti Toko E-Locker Lainnya'
								className='font-orange'
								icon='pencil'
								iconPosition='left'
							/>
						)} 
						filter
						name='pembayaran' 
						selectedLabel='-- Pilih Address' 
						options={Address} 
					/>
				</InputGroup>
			</Container>
		);

	}
};

const mapStateToProps = (state) => {
	return {
		api: state.api.data
	};
};

export default connect(mapStateToProps)(Home);