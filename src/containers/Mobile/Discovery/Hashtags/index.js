import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as hashtagActions } from '@/state/v4/Hashtag';
import { Header, Page, Navigation, Svg, Grid } from '@/components/mobile';
import { Link, withRouter } from 'react-router-dom';

class Hashtags extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.userCookies = this.props.cookies.get('user.token');
		this.getPagePath = this.getPagePath.bind(this);
		this.switchTag = this.switchTag.bind(this);
		this.switchMode = this.switchMode.bind(this);
		this.touchDown = this.touchDown.bind(this);
	}

	componentDidMount() {
		this.props.switchTag(this.props.location.hash);

		const path = this.getPagePath(this.props.location.hash);
		const dataFetch = {
			token: this.userCookies,
			path: `hashtags${path}`,
			docHeight: this.props.products[this.props.activeTag] ? this.props.products[this.props.activeTag].docHeight : 0,
			activeTag: this.props.activeTag
		};
		this.props.fetchData(dataFetch);
		window.addEventListener('scroll', this.touchDown, true);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.touchDown);
	}

	getPagePath(tag) {
		tag = (tag !== '') ? tag : '#All';
		const filtr = this.props.tags.filter((obj) => {
			return obj.hashtag === tag;
		});

		tag = tag.replace('#', '').toLowerCase();
		const tagId = (typeof filtr !== 'undefined' && Array.isArray(filtr) && filtr[0] && filtr[0].id) ? filtr[0].id : false;
		const page = this.props.products[tag] && this.props.products[tag].nextPage ? this.props.products[tag].nextPage : 1;

		let path = tagId ? `?hashtag_id=${tagId}` : '';
		path += (!path) ? `?page=${page}` : `&page=${page}`;
		return path;
	}

	touchDown(e) {
		const body = document.body;
		const html = document.documentElement;

		const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		const scrollY = e.srcElement.scrollTop;
		const scrHeight = window.screen.height;

		if ((scrollY + scrHeight) >= docHeight && this.props.products[this.props.activeTag].allowNextPage && !this.props.isLoading)	{
			const path = this.getPagePath(this.props.location.hash);
			const dataFetch = {
				token: this.userCookies,
				path: `hashtags${path}`,
				docHeight: this.props.products[this.props.activeTag] ? this.props.products[this.props.activeTag].docHeight : 0,
				activeTag: this.props.activeTag
			};
			this.props.fetchData(dataFetch);
		}
	};

	switchTag(e) {
		const tag = e.target.getAttribute('data-tag');
		const switchTag = tag.replace('#', '').toLowerCase();

		if (typeof tag !== 'undefined' && this.props.activeTag !== switchTag) {
			this.props.switchTag(switchTag);

			if ((!this.props.products[switchTag] || this.props.products[switchTag].allowNextPage) && !this.props.isLoading) {
				const path = this.getPagePath(tag);
				const dataFetch = {
					token: this.userCookies,
					path: `hashtags${path}`,
					docHeight: this.props.products[switchTag] ? this.props.products[switchTag].docHeight : 0,
					activeTag: switchTag
				};
				this.props.fetchData(dataFetch);
			}
		}
	};

	switchMode(e) {
		e.preventDefault();
		const mode = (this.props.viewMode === 3) ? 1 : 3;
		this.props.switchMode(mode);
	}

	render() {
		const $props = this.props;
		const $tags = $props.tags.length > 3 ? $props.tags.slice(0, 3) : $props.tags;
		const $items = $props.products[$props.activeTag] && $props.products[$props.activeTag].items
			? $props.products[$props.activeTag].items : [];

		const HeaderPage = {
			left: (
				<button onClick={this.props.history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: '#MauGayaItuGampang',
			right: (
				<a href={'/'} onClick={this.switchMode}>
					|||
				</a>
			)
		};

		return (
			<div>
				<Page>
					<Grid split={4}>
						<div>
							<Link to={'/hashtags/#All'} onClick={this.switchTag} data-tag='#All'>All</Link>
						</div>
						{$tags.map((tag, i) => (
							<div>
								<Link to={`/hashtags/${tag.hashtag}`} onClick={this.switchTag} data-tag={tag.hashtag}>{tag.hashtag}</Link>
							</div>
						))}
					</Grid>
				</Page>

				<Page>
					<Grid split={this.props.viewMode}>
						{$items.map((product, i) => (
							<div>
								<Link to='/hashtags/detail'>
									<img alt='' key={i} src={product.image} />
								</Link>
							</div>
						))}
					</Grid>

					{this.props.isLoading && <button>&hellip;</button>}
				</Page>

				<Header.Modal {...HeaderPage} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	// console.log(state);
	return {
		...state.hashtag
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchData: (fetchData) => dispatch(hashtagActions.itemsFetchData(fetchData)),
		switchTag: (tag) => dispatch(hashtagActions.itemsActiveHashtag(tag)),
		switchMode: (mode) => dispatch(hashtagActions.switchViewMode(mode))
	};
};

export default withRouter(withCookies(connect(mapStateToProps, mapDispatchToProps)(Hashtags)));
