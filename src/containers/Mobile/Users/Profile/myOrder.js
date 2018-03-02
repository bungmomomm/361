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
	List,
	Image
} from '@/components/mobile';

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
			right: null
		});

		return (
			<div style={this.props.style}>
				<Page>
					<Tabs
						current={this.state.current}
						variants={this.menu}
						onPick={(e) => this.handlePick(e)}
					/>
					<div>
						{
							this.dummyData.map((data, key) => {
								return (
									<List key={key}>
										<Link style={{ flexFlow: 'row nowrap' }} to='/'>
											<List.Image><Image width={40} height={40} avatar src='' /></List.Image>
											<List.Content>Pesanan #{data.soNumber}</List.Content>
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
