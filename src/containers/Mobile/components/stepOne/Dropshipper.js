import React, { Component } from 'react';
import { 
	Checkbox, 
	Segment,
	Input, 
	InputGroup, 
} from '@/components';
import { T } from '@/data/translations';

class Dropshipper extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showForm: false,
			dropshipName: '',
			dropshipPhone: '',
		};
	}

	onChange(event, dropshipName, dropshipPhone) {
		dropshipName = event ? dropshipName : '';
		dropshipPhone = event ? dropshipPhone : '';
		this.setState({
			showForm: event,
			dropshipName,
			dropshipPhone
		});
		this.props.onChange(event, dropshipName, dropshipPhone);
	}

	render() {
		return (
			<Segment>
				<Checkbox content={T.checkout.SEND_AS_DROPSHIPPER} onClick={(event) => this.onChange(event, this.state.dropshipName, this.state.dropshipPhone)} value='dropdshipper-on' />
				{
					this.state.showForm && (
						<div>
							<InputGroup>
								<Input 
									type='text' 
									name='dropship_name' 
									placeholder={T.checkout.DROPSHIPPER_NAME}
									validation={{
										rules: 'required',
										name: 'dropship name'
									}}
									ref={(c) => { this.elDropshipName = c; }}
									onChange={(event) => this.onChange(this.state.showForm, event.target.value, this.state.dropshipPhone)}
								/>
							</InputGroup>
							<InputGroup>
								<Input 
									type='number' 
									min={0}
									name='dropship_phone' 
									placeholder={T.checkout.PHONE_NUMBER}
									validation={{
										rules: 'required',
										name: 'dropship phone'
									}}
									ref={(c) => { this.elDropshipPhone = c; }}
									onChange={(event) => this.onChange(this.state.showForm, this.state.dropshipName, event.target.value)}
								/>
							</InputGroup>
						</div>
					)
				}
			</Segment>
		);
	}
}

export default Dropshipper;