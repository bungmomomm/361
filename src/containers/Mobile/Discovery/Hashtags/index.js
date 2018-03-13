import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Hashtag';
import { Header, Page, Navigation, Svg, Grid, Button, Image } from '@/components/mobile';
import { Link, withRouter } from 'react-router-dom';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import Spinner from '@/components/mobile/Spinner';
import Footer from '@/containers/Mobile/Shared/footer';
// import styles from './Hashtags.scss';
import Helmet from 'react-helmet';
import _ from 'lodash';
import currency from 'currency.js';

class Hashtags extends Component {

	state = {
		isFooterShow: true,
	};

	switchTag = (tag) => {
		const switchTag = tag.replace('#', '').toLowerCase();
		const { dispatch, hashtag, cookies } = this.props;

		if (tag && hashtag.active.tag !== switchTag) {
			dispatch(actions.itemsActiveHashtag(tag));

			if (!hashtag.products[switchTag] && !hashtag.loading) {
				const q = dispatch(actions.getQuery());
				const dataFetch = {
					token: cookies.get('user.token'),
					query: q.query
				};
				dispatch(actions.itemsFetchData(dataFetch));
			}
		}
	};

	switchMode = (e) => {
		e.preventDefault();
		const { hashtag, dispatch } = this.props;
		const mode = hashtag.viewMode === 3 ? 1 : 3;
		dispatch(actions.switchViewMode(mode));
	};

	renderGridSmall = (campaign) => {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
					? hashtag.products[hashtag.active.node].items : [];
		const campaignName = campaign.hashtag.replace('#', '');

		return (
			<Grid bordered split={3}>
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignName}-${campaign.campaign_id}/${product.id}`}>
							<Image src={product.image} />
						</Link>
					</div>
				))}
			</Grid>
		);
	};

	renderGridLarge = (campaign) => {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
					? hashtag.products[hashtag.active.node].items : [];
		const campaignName = campaign.hashtag.replace('#', '');

		return (
			<div>
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignName}-${campaign.campaign_id}/${product.id}`}>
							<Image src={product.image} width='100%' />
						</Link>
						<div className='margin--medium-v flex-row flex-spaceBetween flex-middle'>
							<div className='padding--medium-h'>
								<div><Link className='font-color--primary' to='/'>@{product.username}</Link></div>
								<div><em className='font-small font--lato-normal font-color--grey'>{product.created_time}</em></div>
							</div>
							<div className='padding--medium-h'>
								<div className='flex-row flex-middle'>
									<Svg src='ico_lovelist.svg' />
									<span>{currency(product.like, { separator: '.', decimal: ',', precision: 0 }).format()}</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	};

	render() {
		const { hashtag, history, scroller, location, dispatch } = this.props;
		const tags = hashtag.tags;
		const q = dispatch(actions.getQuery());
		const campaign = _.chain(q).get('query.campaign').value() || false;

		const listHastags = (
			<div className='horizontal-scroll'>
				<div className='flex-row flex-centerflex-spaceBetween margin--medium-v margin--none-t'>
					{tags.map((tag, i) => (
						<Link
							to={tag.hashtag.indexOf('#') === -1 ? `/mau-gaya-itu-gampang#${tag.hashtag}` : `/mau-gaya-itu-gampang${tag.hashtag}`}
							onClick={() => this.switchTag(tag.hashtag)}
							key={i}
							className={tag.hashtag.replace('#', '') === hashtag.active.tag.replace('#', '') ? 'padding--medium-h' : 'padding--medium-h font-color--primary-ext-2'}
						>
							{tag.hashtag.indexOf('#') === -1 ? `#${tag.hashtag}` : tag.hashtag}
						</Link>
					))}
				</div>
			</div>
		);

		const isSticky = () => {
			if (this.staticHashtag) {
				const rect = this.staticHashtag.getBoundingClientRect();
				// const threshold = 90;
				return this.props.scroll.top > (rect.top + rect.height);
			}
			return false;
		};

		const HeaderPage = {
			left: (
				<button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: hashtag.header.title,
			right: (
				<Button onClick={this.switchMode}>
					<Svg src={hashtag.viewMode === 3 ? 'ico_list.svg' : 'ico_grid-3x3.svg'} />
				</Button>
			),
			rows: isSticky() ? [{ left: null, center: listHastags, right: null }] : []
		};

		return (
			<div>
				<Page>

					<Helmet>
						<title>{'Mau Gaya Itu Gampang | MatahariMall.com'}</title>
						<meta name='twitter:card' content='summary' />
						<meta name='twitter:site' content='@MatahariMallCom' />
						<meta name='twitter:creator' content='@MatahariMallCom' />
						<meta name='twitter:title' content='Mau Gaya Itu Gampang' />
						<meta name='twitter:url' content={`${process.env.MOBILE_URL}${location.pathname}${location.search}`} />
						<meta name='twitter:description' content='Mau Gaya Itu Gampang' />
						<meta name='twitter:image' content='https://assets.mataharimall.co/images/favicon.ico' />
						<meta property='og:title' content='Mau Gaya Itu Gampang' />
						<meta property='og:url' content={`${process.env.MOBILE_URL}${location.pathname}${location.search}`} />
						<meta property='og:type' content='website' />
						<meta property='og:description' content='Mau Gaya Itu Gampang' />
						<meta property='og:image' content='https://assets.mataharimall.co/images/favicon.ico' />
						<link rel='canonical' url={process.env.MOBILE_URL} />
					</Helmet>

					<div className='margin--medium-v text-center padding--large-h'>
						{hashtag.header.description}
					</div>
					<div ref={(n) => { this.staticHashtag = n; }}>
						{listHastags}
					</div>

					{
						campaign && hashtag.viewMode === 3
						? this.renderGridSmall(campaign)
						: campaign && hashtag.viewMode === 1
						? this.renderGridLarge(campaign)
						: ''
					}
					{scroller.loading && <Spinner />}
					<Footer isShow={this.state.isFooterShow} />
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation scroll={this.props.scroll} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {

	return {
		...state
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, location, cookies } = props;
	await dispatch(actions.initHashtags(cookies.get('user.token'), location.hash));
};

export default withRouter(withCookies(connect(mapStateToProps)(Scroller(Shared(Hashtags, doAfterAnonymous)))));
