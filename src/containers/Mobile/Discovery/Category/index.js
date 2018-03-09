import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header,
	Tabs,
	Page,
	Image,
	Navigation
} from '@/components/mobile';
import styles from './category.scss';
import { actions as categoryActions } from '@/state/v4/Category';
import CONST from '@/constants';
import Shared from '@/containers/Mobile/Shared';
import { actions as sharedActions } from '@/state/v4/Shared';

class Category extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		let selectedSegment = null;
		if (this.props.home.segmen.length > 2) {
			selectedSegment = this.props.home.segmen.find(e => e.key === this.props.shared.current);
		} else {
			selectedSegment = CONST.SEGMENT_INIT.find(e => e.key === this.props.shared.current);
		}
		this.setSegmentCategory(selectedSegment);

		return true;
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.home.segmen !== nextProps.home.segmen) {
			const selectedSegment = nextProps.home.segmen.find(e => e.key === nextProps.shared.current);
			this.setSegmentCategory(selectedSegment);
		}
	}

	setSegmentCategory(selectedSegment) {
		if (selectedSegment) {
			const { dispatch } = this.props;
			dispatch(sharedActions.setCurrentSegment(selectedSegment.key));
			dispatch(new categoryActions.getCategoryMenuAction(this.userCookies, selectedSegment));
		}
	}

	selectSubCategoryHandler(categoryId) {
		const { dispatch } = this.props;
		dispatch(categoryActions.setSubCateogryAction(categoryId));
	}

	handlePick(selectedSegmentId) {
		const selectedSegment = this.props.home.segmen.find(e => e.id === selectedSegmentId);
		if (selectedSegment.key !== this.props.shared.current) {
			this.setSegmentCategory(selectedSegment);
		}
	}

	renderCategories() {
		return this.props.category.categories.length > 1 && this.props.category.categories.map((cat, key) => {
			let url = cat.link;
			switch (cat.type) {
			case CONST.CATEGORY_TYPE.brand:
				url = '/brands';
				break;
			case CONST.CATEGORY_TYPE.newarrival:
				url = '/promo/new_arrival';
				break;
			case CONST.CATEGORY_TYPE.category:
				url = '/sub-category/';
				break;
			default:
				url = '/category/';
				break;
			}

			return (cat.type === CONST.CATEGORY_TYPE.digital) ?
				(
					<a key={key} href={CONST.DIGITAL_URL} className={styles.list}>
						<Image src={cat.image_url} />
						<div className={styles.label}>{cat.title}</div>
					</a>)
				: (
					<Link to={url} key={key} className={styles.list} onClick={() => this.selectSubCategoryHandler(cat.id)}>
						<Image src={cat.image_url} />
						<div className={styles.label}>{cat.title}</div>
					</Link>
				);
		});
	}

	render() {
		const { category } = this.props;
		const loading = (<div />);

		return (
			<div style={this.props.style}>
				<Page>
					<div>
						{ category.loading ? loading : this.renderCategories() }
					</div>
				</Page>
				<Header 
					rows={
						<Tabs
							current={this.props.shared.current}
							variants={this.props.home.segmen}
							onPick={(e) => this.handlePick(e)}
						/>
					} 
					lovelist={this.props.shared.totalLovelist} 
					value={this.props.search.keyword} 
				/>
				<Navigation active='Categories' scroll={this.props.scroll} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		home: state.home,
		shared: state.shared,
		search: state.search
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Category)));
