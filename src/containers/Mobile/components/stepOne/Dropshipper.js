import React, { Component } from 'react';
import { 
	Checkbox,
	Panel,
	Input
} from 'mm-ui';
import { T } from '@/data/translations';
import { pushDataLayer } from '@/utils/gtm';

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

	componentWillReceiveProps(nextProps) {
		if (nextProps.stepState.stepOne.dropshipper.validateDropshipper) {
			this.checkValidation();
		}
	}

	onChange(checked, dropshipName, dropshipPhone) {
		dropshipName = checked ? dropshipName : '';
		dropshipPhone = checked ? dropshipPhone : '';
		this.setState({
			showForm: checked,
			dropshipName,
			dropshipPhone
		});

		const valid = (checked && dropshipName.length > 0 && dropshipPhone.length > 0);
		this.applyValidDropshipper(!checked || valid, checked, dropshipName, dropshipPhone);

		if (this.state.showForm !== checked) {
			pushDataLayer('checkout', 'checkout', { step: 3, option: checked ? 'Dropship' : 'Not Dropship' }, this.props.products);
		}
	}

	applyValidDropshipper(valid, checked = null, dropshipName = '', dropshipPhone = '') {
		const { stepState } = this.props;
		let dropshipper = {
			...stepState.stepOne.dropshipper,
			validDropshipper: valid,
			validateDropshipper: false
		};
		
		if (checked !== null) {
			dropshipper = {
				...dropshipper,
				checked,
				name: dropshipName,
				phone: dropshipPhone
			};
		}

		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				dropshipper
			}
		};
		this.props.applyState(checkoutState);
	}

	checkValidation() {
		let valid = true;

		if (this.state.showForm) {
			const elDropshipName = this.elDropshipName.validation.checkValid();
			const elDropshipPhone = this.elDropshipPhone.validation.checkValid();
			valid = elDropshipName && elDropshipPhone;
		}
		this.applyValidDropshipper(valid);
	}

	render() {
		return (
			<Panel color='grey'>
				<Checkbox onClick={(event) => this.onChange(event.target.checked, this.state.dropshipName, this.state.dropshipPhone)} >{T.checkout.SEND_AS_DROPSHIPPER} </Checkbox>
				{
					this.state.showForm && (
						<div>
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
						</div>
					)
				}
			</Panel>
		);
	}
}

export default Dropshipper;