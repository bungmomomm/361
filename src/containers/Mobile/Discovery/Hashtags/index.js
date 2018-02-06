import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions } from '@/state/v4/Hashtag';
import { Header, Page, Navigation, Svg, Grid, Button, Image } from '@/components/mobile';
import { Link, withRouter } from 'react-router-dom';
import Shared from '@/containers/Mobile/Shared';
import Scroller from '@/containers/Mobile/Shared/scroller';

class Hashtags extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.userCookies = this.props.cookies.get('user.token');
		this.switchTag = this.switchTag.bind(this);
		this.switchMode = this.switchMode.bind(this);
	}

	componentDidMount() {
		const { dispatch, location } = this.props;
		dispatch(actions.initHashtags(this.userCookies, location.hash));
	}

	switchTag(tag) {
		const switchTag = tag.replace('#', '').toLowerCase();
		const { dispatch, hashtag } = this.props;

		if (typeof tag !== 'undefined' && hashtag.active.tag !== switchTag) {
			dispatch(actions.itemsActiveHashtag(tag));

			if (!hashtag.products[switchTag] && !hashtag.isLoading) {
				const q = actions.getQuery(this.props.hashtag);
				const dataFetch = {
					token: this.userCookies,
					query: q.query
				};
				dispatch(actions.itemsFetchData(dataFetch));
			}
		}
	};

	switchMode(e) {
		e.preventDefault();
		const { hashtag, dispatch } = this.props;
		const mode = hashtag.viewMode === 3 ? 1 : 3;
		dispatch(actions.switchViewMode(mode));
	}

	renderGridSmall() {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
					? hashtag.products[hashtag.active.node].items : [];

		return (
			<Grid bordered split={3}>
				{items.map((product, i) => (
					<div key={i}><Image src={product.image} /></div>
				))}
			</Grid>
		);
	}

	renderGridLarge() {
		const { hashtag } = this.props;
		const items = hashtag.products[hashtag.active.node] && hashtag.products[hashtag.active.node].items
					? hashtag.products[hashtag.active.node].items : [];

		return (
			<div>
				{items.map((product, i) => (
					<div key={i}>
						<Image src={product.image} width='100%' />
						<div className='flex-row padding--medium margin--medium'>
							<div><Image avatar height={40} width={40} local src='temp/pp.jpg' /></div>
							<div className='padding--medium'>
								<div><Link className='font-color--primary' to='/'>@vinensiuswibowo</Link></div>
								<div><em className='font-small font--lato-normal font-color--grey'>Post date: 13/12/2017</em></div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	render() {
		const { hashtag, history, scroller } = this.props;
		const tags = hashtag.tags.length > 3 ? hashtag.tags.slice(0, 3) : hashtag.tags;

		const HeaderPage = {
			left: (
				<button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: '#MauGayaItuGampang',
			right: (
				<Button onClick={this.switchMode}>
					<Svg src={hashtag.viewMode === 3 ? 'ico_three-line.svg' : 'ico_grid.svg'} />
				</Button>
			)
		};

		return (
			<div>
				<Page>
					<div className='margin--medium text-center padding--large'>
						Upload gaya OOTD kamu di Instagram dengan hashtag #MauGayaItuGampang dan menangin kesempatan tampil di MatahariMall.com!
					</div>
					<div className='flex-row flex-center flex-spaceBetween margin--medium padding--large'>
						<Link to={'/hashtags#All'} onClick={() => this.switchTag('#All')}>All</Link>
						{tags.map((tag, i) => (
							<Link to={`/hashtags${tag.hashtag}`} onClick={() => this.switchTag(tag.hashtag)} key={i}>{tag.hashtag}</Link>
						))}
					</div>

					{hashtag.viewMode === 3 ? this.renderGridSmall() : this.renderGridLarge()}

					{scroller.loading && <button>&hellip;</button>}
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	// console.log(state.hashtag);
	return {
		...state
	};
};

export default withRouter(withCookies(connect(mapStateToProps)(Shared(Scroller(Hashtags)))));
