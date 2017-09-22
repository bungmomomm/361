import React, { Component } from 'react';
import { 
	Checkbox, 
	Segment,
	Input, 
	InputGroup, 
} from '@/components';

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
				<Checkbox content='Kirim sebagai Dropshipper' onClick={(event) => this.onClick(event)} value='dropdshipper-on' />
				{
					this.state.showForm && (
						<div>
							<InputGroup>
								<Input 
									type='text' 
									name='dropship_name' 
									placeholder='Nama Dropshipper' 
								/>
							</InputGroup>
							<InputGroup>
								<Input 
									type='number' 
									min={0}
									name='dropship_phone' 
									placeholder='No Handphone'
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