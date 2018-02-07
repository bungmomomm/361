import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation, Svg } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import { renderIf } from '@/utils';

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
		console.log('histry length', this.props.history.length);
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
					renderIf(shared && shared.foreverBanner && shared.foreverBanner.text)(
						<ForeverBanner
							color={shared.foreverBanner.text.background_color}
							show={this.state.notification.show}
							onClose={(e) => this.setState({ notification: { show: false } })}
							text1={shared.foreverBanner.text.text1}
							text2={shared.foreverBanner.text.text2}
							textColor={shared.foreverBanner.text.text_color}
							linkValue={shared.foreverBanner.target.url}
						/>
					)
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
