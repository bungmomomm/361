import React, { Component } from 'react';

// component load
import { Checkbox, Segment, Input, InputGroup } from '@/components/Base';

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
		this.props.checkDropship();
	}

	onClick(checked) {
		this.setState({
			showContent: checked
		});
		this.props.setDropship(checked);
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
								message={!this.props.errorDropship ? '' : this.props.errorDropship.first('dropship_name')}
							/>
						</InputGroup>
						<InputGroup>
							<Input 
								type='number' 
								name='dropship_phone' 
								placeholder='No Handphone' 
								onChange={this.onChange}
								errors={!this.props.errorDropship ? false : this.props.errorDropship.has('dropship_phone')}
								message={!this.props.errorDropship ? '' : this.props.errorDropship.first('dropship_phone')}
							/>
						</InputGroup>
					</div>
				) : null
				}
			</Segment>
		);
	}
};