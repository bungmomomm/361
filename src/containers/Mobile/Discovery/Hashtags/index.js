import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Hashtag';
import { Header, /* Page, */ Svg, Grid, /* Button, */ Image, SEO } from '@/components/mobile';
import { Link, withRouter } from 'react-router-dom';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';
import Spinner from '@/components/mobile/Spinner';
import Footer from '@/containers/Mobile/Shared/footer';
import styles from './Hashtags.scss';
import _ from 'lodash';
import currency from 'currency.js';
import { userToken } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';
import { Collector } from '@/utils/tracking/emarsys';

@handler
class Hashtags extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			isFooterShow: false
		};

		this.scrollY = 0;
	}

	componentDidMount() {
		const { hashtag } = this.props;
		this.scrollY = hashtag.scrollY;
		window.scrollTo(0, this.scrollY);

		addEventListener('scroll', this.handleScroll, true);
		addEventListener('resize', this.handleResize, true);
		addEventListener('hashchange', this.hashChange);
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(actions.mutateState({ scrollY: this.scrollY }));

		removeEventListener('scroll', this.handleScroll, true);
		removeEventListener('resize', this.handleResize, true);
		removeEventListener('hashchange', this.hashChange);
	}

	handleScroll = () => {
		this.scrollY = window.scrollY;
	};

	handleResize = () => {
		this.forceUpdate();
	};

	hashChange = () => {
		const { location, hashtag } = this.props;
		let hash = location.hash;
		if ((!location.hash || location.hash === '#root') && hashtag.tags.length) {
			hash = hashtag.tags[0].hashtag;
		}

		this.switchTag(hash);
	};

	switchTag = (tag) => {
		const switchTag = tag.replace('#', '').toLowerCase();
		const { dispatch, hashtag, cookies } = this.props;

		if (tag && hashtag.active.tag !== switchTag) {
			dispatch(actions.itemsActiveHashtag(tag));

			if (!hashtag.products[switchTag] && !hashtag.loading) {
				const q = dispatch(actions.getQuery());
				const dataFetch = {
					token: cookies.get(userToken),
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

	renderGridSmall = (campaignId) => {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
			? hashtag.products[hashtag.active.node].items : [];
		const filtr = hashtag.tags.filter((obj) => {
			return (obj.campaign_id === campaignId);
		});

		const rect = _.round((window.innerWidth > 480 ? 480 : window.innerWidth) / 4);

		return (
			<Grid bordered split={4}>
				{items.map((product, i) => {
					const embedUrl = _.chain(product).get('embed_url').value();
					const icode = (embedUrl.substr(embedUrl.indexOf('/p/')).split('/') || [])[2];

					return (
						<div className='placeholder-image padding--normal' key={i}>
							<Link to={`/361style/${filtr[0].hashtag.replace('#', '')}-${campaignId}/${product.id}/${icode}`}>
								<Image
									lazyload
									width={rect}
									height={rect}
									style={{ objectFit: 'cover' }}
									src={product.image}
								/>
							</Link>
						</div>
					);
				})}
			</Grid>
		);
	};

	renderGridLarge = (campaignId) => {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
			? hashtag.products[hashtag.active.node].items : [];
		const filtr = hashtag.tags.filter((obj) => {
			return (obj.campaign_id === campaignId);
		});

		return (
			<div>
				{items.map((product, i) => {
					const embedUrl = _.chain(product).get('embed_url').value();
					const icode = (embedUrl.substr(embedUrl.indexOf('/p/')).split('/') || [])[2];

					return (
						<div key={i}>
							<Link to={`/mau-gaya-itu-gampang/${filtr[0].hashtag.replace('#', '')}-${campaignId}/${product.id}/${icode || ''}`}>
								<Image lazyload src={product.image} width='100%' />
							</Link>
							<div className='margin--medium-v flex-row flex-spaceBetween flex-middle'>
								<div className='padding--medium-h'>
									<div><Link className='font-color--primary' to='/'>@{product.username}</Link></div>
									<div><em className='font-small font--lato-normal font-color--grey'>{product.created_time}</em>
									</div>
								</div>
								<div className='padding--medium-h'>
									<div className='flex-row flex-middle'>
										<Svg src='ico_lovelist.svg' />
										<span>{currency(product.like, {
											separator: '.',
											decimal: ',',
											precision: 0
										}).format()}</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	render() {
		const { location, hashtag, /* history, */ scroller, dispatch } = this.props;
		const tags = hashtag.tags;
		const q = dispatch(actions.getQuery());
		const campaignId = _.chain(q).get('query.campaign_id').value() || false;

		const listHastags = (
			<div className='horizontal-scroll margin--large-b' style={{ overflowX: 'none' }}>
				<div className='flex-row flex-center flex-spaceBetween margin--medium-v margin--none-t'>
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

		/* const isSticky = () => {
			if (this.staticHashtag) {
				const rect = this.staticHashtag.getBoundingClientRect();
				return window.scrollY > (rect.top + rect.height + 90);
			}
			return false;
		}; */

		return (
			<div>
				<div className={styles.xwrap}>
					<Header />
				</div>
				<div className='container' color='white'>
					<SEO
						paramCanonical={`${process.env.MOBILE_URL}${location.pathname}`}
					/>
					<div className='margin--large-t'><Image local src='banner-361style.png' width='100%' /></div>
					<div className='margin--large-v text-center font-color--primary-ext-1 padding--large-h'>
						{hashtag.header.description}
					</div>
					<div ref={(n) => { this.staticHashtag = n; }}>
						{listHastags}
					</div>

					{
						campaignId && hashtag.viewMode === 3
							? this.renderGridSmall(campaignId)
							: campaignId && hashtag.viewMode === 1
							? this.renderGridLarge(campaignId)
							: ''
					}
					{scroller.loading && <Spinner />}
				</div>
				<Footer isShow /* ={this.state.isFooterShow} */ />
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
	await dispatch(actions.initHashtags(cookies.get(userToken), location.hash));
	Collector.push();
};

export default withRouter(withCookies(connect(mapStateToProps)(Scroller(Shared(Hashtags, doAfterAnonymous)))));
