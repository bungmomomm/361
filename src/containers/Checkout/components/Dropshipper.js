import React, { Component } from 'react';

// component load
import { Checkbox, Segment, Input, InputGroup } from '@/components';

export default class Dropshipper extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onChange = this.onChange.bind(this);
		this.state = {
			showContent: false
		};
	}
	
	onChange(checked) {
		this.setState({
			showContent: checked
		});
	}

	render() {
		return (
			<Segment>
				<Checkbox content='Kirim sebagai Dropshipper' value='dropdshipper-on' onClick={this.onChange} />
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
			</Segment>
		);
	}
};