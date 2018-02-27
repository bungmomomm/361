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
import styles from './Hashtags.scss';

class Hashtags extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.handleScroll = this.handleScroll.bind(this);
		this.state = {
			isFooterShow: true,
			sticky: false
		};
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	handleScroll(e) {
		const { sticky } = this.state;
		if (e.target.scrollTop > 170 && !sticky) {
			this.setState({ sticky: true });
		}
		if (e.target.scrollTop < 170 && sticky) {
			this.setState({ sticky: false });
		}
	}

	switchTag = (tag) => {
		const switchTag = tag.replace('#', '').toLowerCase();
		const { dispatch, hashtag, cookies } = this.props;

		if (typeof tag !== 'undefined' && hashtag.active.tag !== switchTag) {
			dispatch(actions.itemsActiveHashtag(tag === '#All' ? 'All' : tag));

			if (!hashtag.products[switchTag] && !hashtag.loading) {
				const q = actions.getQuery(hashtag);
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
	}

	renderGridSmall = (campaignId) => {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
					? hashtag.products[hashtag.active.node].items : [];

		return (
			<Grid bordered split={3}>
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignId}/${product.id}`}>
							<Image src={product.image} />
						</Link>
					</div>
				))}
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignId}/${product.id}`}>
							<Image src={product.image} />
						</Link>
					</div>
				))}
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignId}/${product.id}`}>
							<Image src={product.image} />
						</Link>
					</div>
				))}
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignId}/${product.id}`}>
							<Image src={product.image} />
						</Link>
					</div>
				))}
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignId}/${product.id}`}>
							<Image src={product.image} />
						</Link>
					</div>
				))}
			</Grid>
		);
	}

	renderGridLarge = (campaignId) => {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
					? hashtag.products[hashtag.active.node].items : [];

		return (
			<div>
				{items.map((product, i) => (
					<div key={i}>
						<Link to={`/mau-gaya-itu-gampang/${campaignId}/${product.id}`}>
							<Image src={product.image} width='100%' />
						</Link>
						<div className='flex-row padding--medium margin--medium'>
							<div><Image avatar height={40} width={40} src={product.image} /></div>
							<div className='padding--medium'>
								<div><Link className='font-color--primary' to='/'>@{product.username}</Link></div>
								<div><em className='font-small font--lato-normal font-color--grey'>Post date: {product.created_time}</em></div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	render() {
		const { hashtag, history, scroller } = this.props;
		const tags = hashtag.tags;
		const q = actions.getQuery(hashtag);
		const campaignId = q.query.campaign_id || 1;

		const HeaderPage = {
			left: (
				<button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: hashtag.header.title,
			right: (
				<Button onClick={this.switchMode}>
					<Svg src={hashtag.viewMode === 3 ? 'ico_list.svg' : 'ico_three-line.svg'} />
				</Button>
			)
		};

		return (
			<div>
				<Page>
					<div className='margin--medium text-center padding--large'>
						{hashtag.header.description}
					</div>
					<div className={this.state.sticky ? styles.sticky : ''}>
						<div className='horizontal-scroll padding--large '>
							<div className='flex-row flex-centerflex-spaceBetween margin--medium'>
								{tags.map((tag, i) => (
									<Link
										to={tag.hashtag.indexOf('#') === -1 ? `/mau-gaya-itu-gampang#${tag.hashtag}` : `/mau-gaya-itu-gampang${tag.hashtag}`}
										onClick={() => this.switchTag(tag.hashtag)}
										key={i}
										className='padding--medium'
									>
										{tag.hashtag}
									</Link>
								))}
								<span className='d-flex padding--medium font-color--primary-ext-2'>#disabled</span>
							</div>
						</div>
					</div>

					{hashtag.viewMode === 3 ? this.renderGridSmall(campaignId) : this.renderGridLarge(campaignId)}
					{scroller.loading && <Spinner />}
					<Footer isShow={this.state.isFooterShow} />
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	const { dispatch, location, cookies } = props;
	dispatch(actions.initHashtags(cookies.get('user.token'), location.hash === '#All' ? 'All' : location.hash));
};

export default withRouter(withCookies(connect(mapStateToProps)(Scroller(Shared(Hashtags, doAfterAnonymous)))));
