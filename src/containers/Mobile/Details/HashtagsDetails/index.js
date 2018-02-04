import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Page, Navigation, Svg, Grid, Card } from '@/components/mobile';
import { actions as hdActions } from '@/state/v4/HashtagsDetails';

class HashtagsDetails extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentDidMount() {
		const { match: { params } } = this.props;
		if (!params || !params.post_id || isNaN(parseInt(params.post_id, 10))) {
			window.location.href = '/404';
		}

		const dataFetch = {
			token: this.userCookies,
			post_id: params.post_id
		};

		this.props.hashtagDetailAction(dataFetch);
	}

	render() {
		const $props = this.props;

		const HeaderPage = {
			left: (
				<button href={$props.history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: '#MauGayaItuGampang',
			right: null
		};

		const $similarproducts = $props.detail.similarproducts && $props.detail.similarproducts.length > 4 ?
			$props.detail.similarproducts.slice(0, 4) : $props.detail.similarproducts;

		return (
			<div>
				<Page>
					{$props.detail.contentdetail && (
						<Grid split={1}>
							<div>
								<img alt='' src={$props.detail.contentdetail.image} />
							</div>
							<div>
								@{$props.detail.contentdetail.user.username}
								<p>
									Post date: {$props.detail.contentdetail.user.created_time} <br />
									{$props.detail.contentdetail.user.caption}
								</p>
							</div>
							<div>
								<h2>Get The Look</h2>
								<Grid split={2}>
									{$similarproducts.length && $similarproducts.map((product, i) =>
										(
											<Card.CatalogSmall key={i} />
										)
									)}
								</Grid>
							</div>
						</Grid>
					)}

					{$props.isLoading && <button>&hellip;</button>}
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state.hashtagsdetails
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		hashtagDetailAction: (token) => dispatch(hdActions.hashtagDetailAction(token)),
		loading: (bool) => dispatch(hdActions.isLoading(bool))
	};
};

export default withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(HashtagsDetails)));
