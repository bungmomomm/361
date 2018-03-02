import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import { Link } from 'react-router-dom';
import {
	Header,
	Svg,
	Page,
	Navigation,
	Tabs,
	List
} from '@/components/mobile';
import styles from './profile.scss';

class MyOrder extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 'Konfirmasi',
		};
		this.menu = [
			{
				id: 0,
				key: 'Konfirmasi',
				title: 'Konfirmasi'
			},
			{
				id: 1,
				key: 'Dikirim',
				title: 'Dikirim'
			},
			{
				id: 2,
				key: 'Selesai',
				title: 'Selesai'
			},
			{
				id: 3,
				key: 'Batal',
				title: 'Batal'
			}
		];
		this.dummyData = [
			{ id: 0, soNumber: 'SO123123', img: '' },
			{ id: 1, soNumber: 'SO123123', img: '' },
			{ id: 2, soNumber: 'SO123123', img: '' },
			{ id: 3, soNumber: 'SO123123', img: '' },
		];
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	handlePick(e) {
		console.log('e', e);
		const newState = this.menu.filter(tab => tab.id === e)[0];
		console.log('newState', newState);
		this.setState({ current: newState.key });
		console.log(this.state);
	}

	render() {
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
				center: (
					<Tabs
						type='minimal'
						current={this.state.current}
						variants={this.menu}
						onPick={(e) => this.handlePick(e)}
					/>
				),
				right: null
			}]
		});

		return (
			<div style={this.props.style}>
				<Page>
					<div className='margin--medium'>
						{
							this.dummyData.map((data, key) => {
								return (
									<List key={key}>
										<Link style={{ flexFlow: 'row nowrap' }} to='/'>
											<List.Image>
												<div className={styles.orderIconCtr}>
													<Svg src='ico_money-time.svg' />
													{/* <Svg src='ico_truck.svg' /> */}
													{/* <Svg src='ico_wallet.svg' /> */}
												</div>
											</List.Image>
											<List.Content>
												<div className='orderDesc'>
													<span>Pesanan <b>#{data.soNumber}</b></span>
													<small className='font-color--primary-ext-3'>06/04/2017</small>
													<small className='font-color--primary-ext-2'>Menunggu Pembayaran</small>
												</div>
											</List.Content>
										</Link>
									</List>
								);
							})
						}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Profile' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Shared(MyOrder)));
