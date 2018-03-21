import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { actions as users } from '@/state/v4/User';
import _ from 'lodash';
import { to } from 'await-to-js';
import {
	Header,
	Page,
	Panel,
	Input,
	Svg,
	Button,
	Radio,
	Image,
	Select,
	Level,
	Notification
} from '@/components/mobile';

class OrderConfirmation extends Component {
	
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			amountTransfer: '',
			bankSenderID: null,
			bankHolderName: '',
			dateSender: '',
			timeSender: '',
			checkedTransferTo: null,
			displayBankTransferFromList: false,
			displayNotification: false,
			notificationMessage: '',
			notificationType: 'SUCCESS',
			selectedBankText: '- Nama Bank Pengirim -'
		};
		
		this.orderId = null;
		this.getDataTransferTo = this.getDataTransferTo.bind(this);
		this.makeRadioTransferToChecked = this.makeRadioTransferToChecked.bind(this);
		this.makeBankFromListVisible = this.makeBankFromListVisible.bind(this);
		this.getDataTransferFrom = this.getDataTransferFrom.bind(this);
		this.clearState = this.clearState.bind(this);
	};
	
	componentDidMount() {
		
		const { location, history, dispatch, cookies } = this.props;
		const query = queryString.parse(location.search);
		const orderId = query.order_id;
		dispatch(users.getMyOrderDetail(cookies.get('user.token'), cookies.get('user.token')));
		// If no order id or there is no order detail exist then throw them to homepage
		if (!orderId || !this.props.users.myOrdersDetail) {
			history.push('/');
		}
		
		this.orderId = orderId;
	}
	
	getDataTransferFrom() {
		
		const { bankList } = this.props.users;
		const dataTransferFrom = [];
		
		if (_.isEmpty(bankList.to_banks) === false) {
			_.map(bankList.to_banks, (value) => {
				const dataForBankTransferFrom = {};
				dataForBankTransferFrom.value = value.id;
				dataForBankTransferFrom.label = value.bank;
				
				dataTransferFrom.push(dataForBankTransferFrom);
			});
		}
		
		return dataTransferFrom;
		
	}
	
	getDataTransferTo() {
		
		const { bankList } = this.props.users;
		const radioDataTransferTo = [];
		
		if (!_.isEmpty(bankList.to_banks)) {
			_.map(bankList.to_banks, (value) => {
				
				const imageAttribute = {
					width: 100,
					height: 20,
					src: value.image_url
				};
				
				const dataForBankTransferTo = {};
				dataForBankTransferTo.value = value.id;
				dataForBankTransferTo.label = (
					<div>
						<Image style={{ alignSelf: 'flex-start' }} {...imageAttribute} />
						<span>No. Rek: <strong>{value.rekening}</strong></span>
					</div>
				);
				
				radioDataTransferTo.push(dataForBankTransferTo);
				
			});
		}
		
		return radioDataTransferTo;
		
	}
	
	clearState() {
		
		this.setState({
			amountTransfer: '',
			bankSenderID: null,
			bankHolderName: '',
			dateSender: '',
			timeSender: '',
			checkedTransferTo: '',
			selectedBankText: '- Nama Bank Pengirim - '
		});
	}
 
	makeRadioTransferToChecked(id) {
		this.setState({
			checkedTransferTo: id
		});
	}
	
	makeBankFromListVisible() {
		this.setState({
			displayBankTransferFromList: true
		});
	}
	
	async sendPostOrderConfirmation(e) {

		const {
			amountTransfer,
			bankSenderID,
			bankHolderName,
			dateSender,
			timeSender,
			checkedTransferTo
		} = this.state;
		
		const { dispatch, cookies } = this.props;
		
		// Do the form validation.
		if (
			amountTransfer === ''
			&& bankSenderID === null
			&& bankHolderName === ''
			&& dateSender === ''
			&& timeSender === ''
			&& checkedTransferTo === null
		) {
			this.setState(() => {
				return {
					displayNotification: true,
					notificationMessage: 'Mohon Pastikan Semua Field Terisi !',
					notificationType: 'ERROR'
				};
			});
			return false;
		}

		const postData = {
			amountTransfer,
			bankSenderID,
			bankHolderName,
			dateSender,
			timeSender,
			checkedTransferTo
		};
		
		const [error, response] = await to(dispatch(new users.PostOrderConfirmation(cookies.get('user.token'), postData)));
  
		console.log('postData');
		console.log(postData);
		
		if (error) {
			return false;
		}
		
		this.setState(() => {
			return {
				displayNotification: true,
				notificationMessage: 'Data Konfirmasi Order Anda Berhasil Disimpan !',
				notificationType: 'SUCCESS'
			};
		}, this.clearState);
		
		return response;
		
	}
 
	render() {
		
		const {
			displayNotification,
			displayBankTransferFromList,
			checkedTransferTo,
            notificationMessage,
			notificationType,
            amountTransfer,
            dateSender,
            timeSender,
            bankHolderName,
            selectedBankText
		} = this.state;
		
		const HeaderPage = ({
			left: (
				<Link to={'/profile'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Pesanan Saya',
			right: null,
			rows: [{
				left: null,
				center: '',
				right: null
			}]
		});
  
		const inputAmountTransferAttribute = {
			label: 'Jumlah Yang Ditransfer',
			type: 'text',
			flat: true,
			value: amountTransfer,
			placeholder: 'Jumlah Yang Ditransfer',
			onChange: (event) => {
				const regex = /^[0-9\b]+$/;
				const { value } = event.target;
				if (value !== '' && regex.test(value)) {
					
					this.setState({
						amountTransfer: event.target.value
					});
					
				}
			}
		};
		
		const inputHolderBankNameAttribute = {
			label: 'Nama Pemegang Rekening',
			type: 'text',
			flat: true,
			value: bankHolderName,
			placeholder: 'Nama Pemegang Rekening',
			onChange: (event) => {
				this.setState({
					bankHolderName: event.target.value
				});
			}
		};
		
		const inputDateAttribute = {
			label: 'Tanggal Transfer',
			type: 'date',
			flat: true,
			value: dateSender,
			placeholder: 'Nama Pemegang Rekening',
			onChange: (event) => {
				this.setState({
					dateSender: event.target.value
				});
			}
		};
		
		const inputTimeAttribute = {
			label: 'Waktu Transfer',
			type: 'time',
			flat: true,
			value: timeSender,
			placeholder: 'Jam Transfer',
			onChange: (event) => {
				this.setState({
					timeSender: event.target.value
				});
			}
		};
		
		const buttonPostAttribute = {
			color: 'primary',
			size: 'large',
			inline: true,
			onClick: (e) => this.sendPostOrderConfirmation(e)
		};
		
		const notificationAttribute = {
			show: true,
			color: 'green',
			disableClose: true
		};
		
		if (notificationType === 'ERROR') {
			notificationAttribute.color = 'pink';
		}
		
		const selectFromBankAttribute = {
			horizontal: true,
			options: this.getDataTransferFrom(),
			show: false,
			onClose: () => {
				this.setState({
					displayBankTransferFromList: false
				});
			},
			onChange: (e) => {
				this.setState({
					bankSenderID: e
				}, () => {
					
					const { bankList } = this.props.users;
					const selectedBank = _.find(bankList.from_banks, { id: this.state.bankSenderID }) || null;
					
					if (selectedBank !== null) {
						this.setState({
							selectedBankText: selectedBank.bank
						});
					}
     
				});
			}
		};
		
		if (displayBankTransferFromList === true) {
			selectFromBankAttribute.show = true;
		}

		const radioTransferToAttribute = {
			list: true,
			name: 'transfer-to',
			checked: checkedTransferTo,
			onChange: this.makeRadioTransferToChecked,
			data: this.getDataTransferTo()
		};
		
		return (
			<div style={this.props.style}>
				<Page>
					<div className='padding--large-h padding--medium-v margin--medium-v bg--white'>
						<div className='margin--medium-b'>
							Pemesanan dengan Bank Transfer akan otomatis dibatalkan oleh sistem kami jika pembayaran tidak diterima dalam waktu 24 jam.
						</div>
						
						<Panel
							color='blue'
							className='padding--normal flex-row flex-spaceBetween'
							style={{ marginBottom: '10px' }}
						>
							<span>Order ID</span>
							<strong>
								{this.orderId}
							</strong>
						</Panel>
						{
							displayNotification
							&& (
								<Notification
									style={{ marginBottom: '10px' }}
									{...notificationAttribute}
								>
									<span> {notificationMessage} </span>
								</Notification>
							)
						}
						
						
						<form className='margin--large flex-column'>
							<Input {...inputAmountTransferAttribute} />
							<Level
								className='flex-row border-bottom'
								onClick={this.makeBankFromListVisible}
							>
								<Level.Left>
									<Button className='flex-center'>
										<span style={{ marginRight: '10px' }}>
											{ selectedBankText }
										</span>
									</Button>
								</Level.Left>
								<Level.Right>
									<Svg src='ico_chevron-down.svg' />
								</Level.Right>
							</Level>
							<Select {...selectFromBankAttribute} />
							<Input {...inputHolderBankNameAttribute} />
							<Input {...inputDateAttribute} />
							<Input {...inputTimeAttribute} />
							
							<strong className='font-medium margin--medium-v'>Pilih Bank Transfer Tujuan</strong>
							<Radio {...radioTransferToAttribute} />
							
							<div className='margin--medium-v'>
								<Button {...buttonPostAttribute}>
									Konfirmasi
								</Button>
							</div>
						</form>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

const doAfterAnonymous = async (props) => {
 
	const { dispatch, cookies } = props;
	dispatch(new users.getListBankConfirmation(cookies.get('user.token')));
 
};

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Shared(OrderConfirmation, doAfterAnonymous)));