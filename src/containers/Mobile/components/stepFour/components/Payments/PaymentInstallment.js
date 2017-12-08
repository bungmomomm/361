import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions } from '@/state/Payment';
import styles from '@/containers/Mobile/mobile.scss';
import Tooltip from '../Tooltip';

// component load
import {
	CreditCardInput,
	Sprites
} from '@/components';
import { Group, Select, Input, Icon, Level } from 'mm-ui';
import { Bulan } from '@/data';
import { T } from '@/data/translations';

class PaymentInstallment extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			installmentList: [],
			validInstallmentBin: null,
			tooltip: '',
			cvv: ''
		};
		this.card = '';
		this.bank = '';		
		this.ccvValue = '';
		this.tahun = [{ value: null, label: 'tahun' }];
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillMount() {
		const date = new Date();
		const thisYear = date.getFullYear();
		for (let year = thisYear; year < (thisYear + 10); year++) {
			this.tahun.push({ value: year, label: year });
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments) {
			this.validateInstallmentForm();
		}
	}

	onBankChange(bank) {
		this.bank = bank.value;		
		const { dispatch, payments } = this.props;
		if (bank.value !== null) {
			const selectedPaymentOption = new actions.getAvailabelPaymentSelection(payments.selectedPayment);
			this.setState({
				form: {
					...this.state.form,
					selectedPaymentOption: bank.value.value
				}
			});
			dispatch(new actions.bankNameChange(this.cookies, bank, selectedPaymentOption));
		}
		this.checkValidInstallment(this.card);
	}

	onTermChange(term) {
		const { dispatch, payments, appliedBin } = this.props;
		const selectedPaymentOption = new actions.getAvailabelPaymentSelection(payments.selectedPayment);
		payments.selectedPaymentOption = selectedPaymentOption;
		const bank = (!payments.selectedBank) ? '' : payments.selectedBank.value.value;
		const cardNumber = appliedBin ? appliedBin.cardNumber : '';
		dispatch(new actions.applyBin(this.cookies, selectedPaymentOption.value, cardNumber, bank, term.term));
		dispatch(new actions.termChange(term));
		this.setState({
			form: {
				...this.state.form,
				term: term.value
			}
		});
	}
	
	onChangeCVV(e) {
		if (!e.target.value.match(/[^0-9]/i)) {
			this.ccvValue = e.target.value;
			this.props.dispatch(new actions.changeInstallmentCCCvv(e.target.value));
			this.setState({
				cvv: this.ccvValue
			});
		}
	}

	onInstallmentCCNumberChange(event) {
		this.props.dispatch(new actions.changeInstallmentCCNumber(event.ccNumber, event.ccType));
		const selectedPaymentOption = new actions.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
		const bank = (!this.props.payments.selectedBank) ? '' : this.props.payments.selectedBank.value.value;
		const term = (this.props.payments.term && this.props.payments.term.term) ? this.props.payments.term.term : '';
		if (event.valid) {
			this.props.dispatch(new actions.applyBin(this.cookies, selectedPaymentOption.value, event.ccNumber, bank, term))
			.then(success => {
				this.props.dispatch(new actions.refreshInstallmentTerm(this.props.payments.selectedPayment, success));
			});
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event.ccNumber,
					bankName: bank,
					installment_term: term
				},
				cardValidLuhn: true
			});
		} else {
			this.props.dispatch(new actions.applyBin(this.cookies, -1, event.ccNumber, bank, term));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: '',
					bankName: bank,
					installment_term: term
				},
				cardValidLuhn: false
			});
		}
	}

	setInstallmentList(list) {
		const installmentList = [];
		list.listCicilan.map((item, idx) => (
			installmentList.push({
				label: item.label,
				value: item.value.term
			})
		));
		this.setState({ installmentList });
	}

	showTooltip(content) {
		let tooltip = '';
		if (content.length) {
			tooltip = content.join('<br />');
		}
		this.setState({ tooltip });
	}

	checkValidInstallment(event) {
		this.card = event || '';		
		if (event.valid && event.valid !== null && event.ccNumber.length > 1) {
			const { blockContent } = this.props;
			const bank = this.bank === '' ? 'mandiri' : this.bank.value;
			const installmentBin = blockContent.filter(e => parseInt(e.id, 10) === 660)[0] || null;
			if (typeof installmentBin === 'object') {
				const installmentBinBank = JSON.parse(installmentBin.attributes.block)[`${bank.replace(' ', '_').toUpperCase()}`];
				const checkingBin = installmentBinBank.filter(e => event.ccNumber.startsWith(e));
				if (checkingBin.length > 0) {
					this.onInstallmentCCNumberChange(event);
					this.setState({ validInstallmentBin: true });
				} else {
					this.setState({ validInstallmentBin: false });
				}
			}
		} else {
			this.setState({ validInstallmentBin: false });
		}
		this.validateInstallmentForm();
	}

	validateInstallmentForm() {
		setTimeout(() => {
			if (
				!!this.elBank.state.selected.value &&
				!!this.elTerms.state.selected &&
				this.elCreditCard.state.ccValid === 'green' &&
				this.elMonthInstallment.state.selected !== null &&
				this.elYearInstallment.state.selected !== null &&
				this.ccvValue !== '' &&
				this.state.validInstallmentBin
			) {
				this.props.enableButtonPayNow(true);
			} else {
				this.props.enableButtonPayNow(false);
			}
		}, 100);
	}

	renderInstallmentList() {
		const { installmentList } = this.props;
		if (typeof installmentList === 'object') {
			return <Select ref={(c) => { this.elTerms = c; }} block options={installmentList} onChange={(e) => this.onTermChange(e)} />;
		}
		return null;
	}

	render() {
		const { payments, dispatch } = this.props;
		const { validInstallmentBin } = this.state;
		const installmentTooltip = [`<p>Syarat dan Ketentuan Cicilan 0% Regular:</p>
									<ul>
										<li>Cicilan tenor 3 bulan dengan minimum transaksi Rp990.000
										(sembilan ratus sembilan puluh ribu rupiah)</li>
										<li>Cicilan tenor 6 bulan dengan minimum transaksi Rp1.500.000
										(satu juta lima ratus ribu rupiah)</li>
										<li>Cicilan tenor 12 bulan dengan minimum transaksi Rp2.000.000
										(dua juta rupiah)</li>
									</ul>`];
		return (
			<Group>
				<Level>
					<Level.Left>&nbsp;</Level.Left>
					<Level.Right>
						<span className={styles.tooltipButton} role='button' tabIndex='-1' onClick={() => this.showTooltip(installmentTooltip)}>
							{<Icon name='exclamation-circle' />}
						</span>
						{
							this.state.tooltip && (
								<Tooltip 
									show 
									content={this.state.tooltip} 
									onClose={() => this.setState({ tooltip: '' })}
								/>
							)
						}
					</Level.Right>
				</Level>
				
				<Select 
					block 
					options={payments.selectedPayment.paymentItems[0].banks} 
					onChange={(e) => this.onBankChange(e)} 
					defaultValue={payments.selectedBank.value || ''}
					ref={(c) => { this.elBank = c; }}
				/>
				{this.renderInstallmentList()}
				<CreditCardInput
					placeholder={T.checkout.INPUT_CART_NUMBER}
					color={!validInstallmentBin && validInstallmentBin !== null ? 'red' : ''}
					sprites='payment-option'
					disableMaskInput
					onChange={(e) => this.checkValidInstallment(e)}
					ref={(c) => { this.elCreditCard = c; }}
					message={!validInstallmentBin && validInstallmentBin !== null ? T.checkout.INPUT_MATCHED_CART_NUMBER : ''}
					validation={{ rules: 'required|max_value:16', name: 'cc' }}
				/>
				<Group grouped>
					<Select
						options={Bulan}
						onChange={(e) => dispatch(new actions.changeInstallmentCCMonth(e.value))}
						validation={{ rules: 'required|min_value:1', name: 'month' }}
						ref={(c) => { this.elMonthInstallment = c; }}
					/>
					<Select
						block
						options={this.tahun}
						onChange={(e) => dispatch(new actions.changeInstallmentCCYear(e.value))}
						validation={{ rules: 'required|min_value:10|min:1', name: 'year' }}
						ref={(c) => { this.elYearInstallment = c; }}
					/>
					<Input
						dataProps={{ minLength: 0, maxLength: 4, value: this.state.cvv }}
						type='password'
						placeholder='cvv'
						onChange={(e) => this.onChangeCVV(e)}
						validation={{ rules: 'required|numeric|min_value:1', name: 'cvv' }}
						ref={(c) => { this.elCvvInstallment = c; }}
					/>
					<div style={{ paddingRight: '30px' }} ><Sprites name='cvv' /></div>
				</Group>
			</Group>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		payments: state.payments,
		blockContent: state.global.blockContent
	};
};

export default withCookies(connect(mapStateToProps)(PaymentInstallment));