import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import {
	Header,
	Svg,
	Level,
	Page,
	Timeline,
	Spinner
} from '@/components/mobile';
import { actions as userAction } from '@/state/v4/User';
import { userToken, isLogin } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class MyOrderDetail extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {};
		this.provider = this.props.match.params.provider;
		this.so_number = this.props.match.params.so_number;
		this.isLogin = this.props.cookies.get(isLogin) === 'true';

		if (this.isLogin !== true) {
			this.props.history.push('/');
		}
	}

	componentWillMount() {
		if ('serviceUrl' in this.props.shared) {
			const { cookies, dispatch } = this.props;
			dispatch(userAction.getTrackingInfo(cookies.get(userToken), this.provider, this.so_number));
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			const { cookies, dispatch } = this.props;
			dispatch(userAction.getTrackingInfo(cookies.get(userToken), this.provider, this.so_number));
		}

		if (nextProps.user.trackingInfo !== this.props.user.trackingInfo && nextProps.user.trackingInfo === false) {
			this.props.history.push('/profile/my-order');
		}
	}

	renderTopInfo() {
		const tracking = this.props.user.trackingInfo;
		return tracking && (
			<Level className='padding--none-h padding--medium-v' style={{ borderBottom: '1px solid #D8D8D8' }}>
				<Level.Left className='padding--medium-r'><Svg src='ico_truck-2.svg' /></Level.Left>
				<Level.Item>
					<strong>Status {tracking.status}</strong>
					<p><small>
						No. Resi: {tracking.resi}<br />
						Layanan Pengiriman: {tracking.shipping_method}
					</small></p>
				</Level.Item>
			</Level>
		);
	}

	renderTimeline() {
		const tracking = this.props.user.trackingInfo;
		const total = tracking && tracking.historical && tracking.historical.length;
		const timeline = total > 0 && tracking.historical && tracking.historical.map((item, key) => {
			const active = (key === 0) && ({ active: 'active' });
			return (
				<Timeline.Item {...active} key={key}>
					<Timeline.Header>{item.status}</Timeline.Header>
					<Timeline.Content><small>{item.time}</small></Timeline.Content>
				</Timeline.Item>
			);
		});
		return tracking && (
			<Timeline className='margin--medium-v '>
				{timeline}
			</Timeline>
		);
	}

	render() {
		const HeaderPage = ({
			left: (
				<span
					onClick={() => this.props.history.goBack()}
					role='button'
					tabIndex='0'
				>
					<Svg src='ico_close-large.svg' />
				</span>
			),
			center: 'Lacak Pesanan',
			right: null
		});

		return (
			<div style={this.props.style}>
				<Page>
					{this.props.user.trackingInfo === null ?
						(
							<div className='margin--medium-v padding--medium-h'>
								<div style={{ padding: '10px' }}><Spinner /></div>
							</div>
						) : (
					<div className='margin--medium-v padding--medium-h bg--white'>
						{this.renderTopInfo()}
						{this.renderTimeline()}
					</div>
						)}
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		user: state.users
	};
};

export default withCookies(connect(mapStateToProps)(Shared(MyOrderDetail)));
