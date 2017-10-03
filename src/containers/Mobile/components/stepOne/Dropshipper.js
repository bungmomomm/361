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
			showForm: false
		};
	}

	onClick(event) {
		this.setState({
			showForm: event.target.checked
		});
	}
	
	render() {
		return (
			<Segment>
				<Checkbox content={T.checkout.SEND_AS_DROPSHIPPER} onClick={(event) => this.onClick(event)} value='dropdshipper-on' />
				{
					this.state.showForm && (
						<div>
							<InputGroup>
								<Input 
									type='text' 
									name='dropship_name' 
									placeholder={T.checkout.DROPSHIPPER_NAME}
								/>
							</InputGroup>
							<InputGroup>
								<Input 
									type='number' 
									min={0}
									name='dropship_phone' 
									placeholder={T.checkout.PHONE_NUMBER}
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