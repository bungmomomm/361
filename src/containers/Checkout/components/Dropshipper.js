import React, { Component } from 'react';

// component load
import { Checkbox, Box, Input, InputGroup } from '@/components/Base';

export default class Dropshipper extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showContent: false
		};
		this.onChange = this.onChange.bind(this);
	}
	
	onChange(event) {
		this.setState({
			showContent: event
		});
	}

	render() {
		return (
			<Box>
				<Checkbox text='Kirim sebagai Dropshipper' value='dropdshipper-on' onChange={this.onChange} />
				{
				this.state.showContent ? (
					<div>
						<InputGroup>
							<Input type='text' placeholder='Nama Dropshipper' />
						</InputGroup>
						<InputGroup>
							<Input type='number' placeholder='No Handphone' />
						</InputGroup>
					</div>
				) : null
				}
			</Box>
		);
	}
};