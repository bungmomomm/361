import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { actions as users } from '@/state/v4/user';
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
	Select
} from '@/components/mobile';

class OrderConfirmation extends Component {
	
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			amountTransfer: '',
			bankSenderName: '',
			bankHolderName: '',
			dateSender: '',
			timeSender: '',
			checkedTransferTo: null,
			sendSuccess: false
		};
		this.bankList = {
			from_banks: [
				{
					value: 1,
					label: 'Bank BCA'
				},
				{
					value: 2,
					label: 'Bank Mandiri'
				},
				{
					value: 3,
					label: 'Bank Nobu'
				},
				{
					value: 4,
					label: 'Bank Permata'
				}
			],
			to_banks: [
				{
					id: 1,
					bank: 'Bank BCA',
					rekening: '470-010-122-700',
					image_url: 'https://mm-image-marketing.mataharimall.co/img/static/mataharimall_logo.png'
				},
				{
					id: 2,
					bank: 'Bank Mandiri',
					rekening: '470-010-122-700',
					image_url: 'https://mm-image-marketing.mataharimall.co/img/static/mataharimall_logo.png'
				},
				{
					id: 3,
					bank: 'Bank Nobu',
					rekening: '470-010-122-700',
					image_url: 'https://mm-image-marketing.mataharimall.co/img/static/mataharimall_logo.png'
				}
			]
		};
		
		this.orderId = '';
		this.getRadioDataTransferTo = this.getRadioDataTransferTo.bind(this);
		this.makeRadioTransferToChecked = this.makeRadioTransferToChecked.bind(this);
	};

	componentDidMount() {
		
		const { location, history } = this.props;
		const query = queryString.parse(location.search);
		const orderId = query.order_id;
		
		if (!orderId) {
			history.push('/');
		}
		
		this.orderId = orderId;
	}

	getRadioDataTransferTo() {
		
		const radioDataTransferTo = [];
		if (_.isEmpty(this.bankList.to_banks) === false) {
			_.map(this.bankList.to_banks, (value) => {
				
				const imageAttribute = {
					width: 100,
					height: 20,
					src: value.image_url
				};
				
				const objectData = {};
				objectData.value = value.id;
				objectData.label = (
					<div>
						<Image style={{ alignSelf: 'flex-start' }} {...imageAttribute} />
						<span>No. Rek: <strong>{value.rekening}</strong></span>
					</div>
				);
				radioDataTransferTo.push(objectData);
			});
		}
		
		return radioDataTransferTo;
		
	}
 
	makeRadioTransferToChecked(id) {
		
		this.setState({
			checkedTransferTo: id
		});
		
	}
	
	async sendPostOrderConfirmation(e) {

		const { amountTransfer, bankSenderName, bankHolderName, dateSender, timeSender, checkedTransferTo } = this.state;
		
		const { dispatch, cookies } = this.props;
		
		const [error, response] = await to(dispatch(new users.PostOrderConfirmation(cookies.get('user.token'))));
		
		console.log(amountTransfer);
		console.log(bankSenderName);
		console.log(bankHolderName);
		console.log(dateSender);
		console.log(timeSender);
		console.log(checkedTransferTo);
        
		console.log('error');
		console.log(error);
		console.log('response');
		console.log(response);
		
		if (error) {
			return false;
		}
		
		return response;
		
	}
 
	render() {
		
		const { checkedTransferTo } = this.state;
  
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
		
		const inputSenderBankNameAttribute = {
			label: 'Nama Bank Pengirim',
			type: 'text',
			flat: true,
			placeholder: 'Nama Bank Pengirim',
			onChange: (event) => {
				this.setState({
					bankSenderName: event.target.value
				});
			}
		};
		
		const inputHolderBankNameAttribute = {
			label: 'Nama Pemegang Rekening',
			type: 'text',
			flat: true,
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
		
		const selectFromBankAttribute = {
			horizontal: true,
			options: this.bankList.from_banks,
			show: false,
			onClick: () => { console.log('Yes'); }
		};
		
		
		const radioTransferToAttribute = {
			list: true,
			name: 'transfer-to',
			checked: checkedTransferTo,
			onChange: this.makeRadioTransferToChecked,
			data: this.getRadioDataTransferTo()
		};
		
		console.log('My Props');
		console.log(this.props);
		

		return (
			<div style={this.props.style}>
				<Page>
					<div className='padding--large-h padding--medium-v margin--medium-v bg--white'>
						<div className='margin--medium-b'>
							Pemesanan dengan Bank Transfer akan otomatis dibatalkan oleh sistem kami jika pembayaran tidak diterima dalam waktu 24 jam.
						</div>
						<Panel color='blue' className='padding--normal flex-row flex-spaceBetween'>
							<span>Order ID</span><strong>{this.orderId}</strong>
						</Panel>
						<form className='margin--large flex-column'>
							
							<Input {...inputAmountTransferAttribute} />
							<Input {...inputSenderBankNameAttribute} />
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
	dispatch(new users.ListBankConfirmation(cookies.get('user.token')));
 
};

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Shared(OrderConfirmation, doAfterAnonymous)));
