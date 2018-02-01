import React, { PureComponent } from 'react';
import { withCookies } from 'react-cookie';
import { Header, Page, Navigation, Svg } from '@/components/mobile';
import { connect } from 'react-redux';

class Page404 extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
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

		return (
			<div style={this.props.style}>
				<Page.Page404 />
				<Header.Modal {...HeaderPage} />
				<Navigation active='Home' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		keyword: state.search.keyword,
	};
};

export default withCookies(connect(mapStateToProps)(Page404));
