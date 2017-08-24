import React, { Component } from 'react';

// component load
import { Checkbox, Segment, Input, InputGroup } from '@/components';

export default class Dropshipper extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onChange = this.onChange.bind(this);
		this.onClick = this.onClick.bind(this);
		this.state = {
			showContent: false
		};
	}
	
	onChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.props.setDropship(this.state.showContent, name, value);		
		this.props.checkDropship(name);
	}

	onClick(checked) {
		this.setState({
			showContent: checked
		});
		this.props.setDropship(checked, null, null, true);
	}

	render() {
		return (
			<Segment>
				<Checkbox content='Kirim sebagai Dropshipper' value='dropdshipper-on' onClick={this.onClick} />
				{
				this.state.showContent ? (
					<div>
						<InputGroup>
							<Input 
								type='text' 
								name='dropship_name' 
								placeholder='Nama Dropshipper' 
								onChange={this.onChange}
								errors={!this.props.errorDropship ? false : this.props.errorDropship.has('dropship_name')}
								message={!this.props.errorDropship ? '' : (this.props.errorDropship.first('dropship_name') ? 'Nama dropshipper harus diisi' : '')}
							/>
						</InputGroup>
						<InputGroup>
							<Input 
								type='number' 
								name='dropship_phone' 
								placeholder='No Handphone' 
								onChange={this.onChange}
								errors={!this.props.errorDropship ? false : this.props.errorDropship.has('dropship_phone')}
								message={!this.props.errorDropship ? '' : (this.props.errorDropship.first('dropship_phone') ? 'Salah format, minimal 6 maksimal 14 digit' : '')}
							/>
						</InputGroup>
					</div>
				) : null
				}
			</Segment>
		);
	}
};