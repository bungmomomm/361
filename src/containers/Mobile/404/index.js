import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation, Svg } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';

class Page404 extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			notification: {
				show: true
			}
		};
	}

	render() {
		// @todo : inline styling due to slicing component not ready
		const inlineStyle = {
			textAlign: 'center',
			margin: '10px auto 10px auto'
		};


		let back = () => { this.props.history.go(-2); };
		if (this.props.history.length < 2) {
			back = () => { this.props.history.push('/'); };
		}

		const HeaderPage = {
			left: (
				<button onClick={back}> <Svg src={'ico_arrow-back-left.svg'} /></button>
			),
			center: '404',
		};
		const { shared } = this.props;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });
		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.container} >
						<div style={inlineStyle}>[image 404]</div>
						<div style={inlineStyle}>
							OOPS!
						</div>
						<div style={inlineStyle}>
							Maaf, halaman yang kamu tuju tidak ditemukan.
						</div>
						<div style={inlineStyle}>
							Periksa kembali link yang kamu tuju.
						</div>
						<div style={inlineStyle}>[Rich Relevant Recommendation section]</div>
						<div style={inlineStyle}>[Footer]</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Home' />
				{
					<ForeverBanner {...foreverBannerData} />
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		keyword: state.search.keyword,
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Page404));
