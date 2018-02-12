import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header,
	Divider,
	Svg,
	Page,
	List,
	Image,
	Navigation
} from '@/components/mobile';
import { actions as categoryActions } from '@/state/v4/Category';
import Shared from '@/containers/Mobile/Shared';
import CONST from '@/constants';

class SubCategory extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedCategory: {}
		};
		this.categoryLvl1 = props.match.params.categoryLvl1;
		this.categoryLvl2 = props.match.params.categoryLvl2;
		this.categoryLvl3 = props.match.params.categoryLvl3;
		this.userCookies = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.userRFCookies = this.props.cookies.get(CONST.COOKIE_USER_RF_TOKEN);
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		this.setSelectedCategory(this.props.category.categories);
	}

	componentWillReceiveProps(nextProps) {
		const isCategoryMenuDataUpdated = nextProps.category.categories.length > 1 &&
			nextProps.category.categories !== this.props.category.categories;
		if (isCategoryMenuDataUpdated) {
			this.setSelectedCategory(nextProps.category.categories);
		}
	}

	setSelectedCategory(categories) {
		let selectedCategory = categories.filter(e => e.id.toString() === this.categoryLvl2)[0];
		if (selectedCategory) {
			selectedCategory = (this.categoryLvl3 !== undefined) ?
				selectedCategory.sub_categories.filter(e => e.id.toString() === this.categoryLvl3)[0] : selectedCategory;

			if (selectedCategory === undefined) {
				return this.props.history.push('/category/');
			}

			const categorySlug = selectedCategory.title.replace(/ /g, '-').toLowerCase();
			if (selectedCategory.sub_categories.length === 0) {
				return this.props.history.push(`/p-${selectedCategory.id}/${categorySlug}`);
			}

			this.getFeaturedBrands(selectedCategory.id);

			this.setState({
				selectedCategory
			});
		}

		if (categories.length > 1 && selectedCategory === undefined) {
			return this.props.history.push('/category/');
		}
		return true;
	}

	getFeaturedBrands(categoryId) {
		const { dispatch } = this.props;
		dispatch(new categoryActions.getBrandsByCategoryIdAction(this.userCookies, categoryId));
	}

	render() {
		const { selectedCategory } = this.state;
		const HeaderPage = {
			left: (
				<button onClick={this.props.history.goBack}>
					<Svg src='ico_arrow-back-left.svg' />
				</button>
			),
			center: selectedCategory.title || '',
			right: null
		};

		const listCategory = selectedCategory.sub_categories && selectedCategory.sub_categories.map((cat, key) => {
			let list = null;
			if (this.categoryLvl3 === undefined) {
				list = (
					<List key={key}>
						<Link style={{ flexFlow: 'row nowrap' }} to={`/category/${this.categoryLvl1}/${this.categoryLvl2}/${cat.id}`}>
							<List.Image><Image width={40} height={40} avatar src={cat.image_url} /></List.Image>
							<List.Content>{cat.title}</List.Content>
						</Link>
					</List>
				);
			} else {
				list = (
					<List style={{ flexFlow: 'row nowrap' }} key={key}>
						<Link to={`/p-${cat.id}/${cat.title}`}>
							<List.Image><Image width={40} height={40} avatar src={cat.image_url} /></List.Image>
							<List.Content>{cat.title}</List.Content>
						</Link>
					</List>
				);
			}
			return list;
		});

		const listFeaturedBrands = this.props.category.brands && this.props.category.brands.map((brand, key) => {
			return (
				<List key={key}>
					<Link style={{ flexFlow: 'row nowrap' }} to={`/brand/${brand.id}/${brand.title}`}>
						<List.Image><Image width={40} height={40} avatar src={brand.image_url} /></List.Image>
						<List.Content>{brand.title}</List.Content>
					</Link>
				</List>
			);
		});

		const loadingDisplay = ('');

		return (
			<div style={this.props.style}>
				<Page>
					{ this.props.category.loading ? loadingDisplay :
						(<div>
							<Divider>Shop by Products</Divider>
							{listCategory}
						</div>)
					}
					{ this.props.category.loadingBrands ? loadingDisplay :
						(<div>
							<Divider>Featured Brands</Divider>
							{listFeaturedBrands}
						</div>)
					}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Categories' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		home: state.home,
	};
};

const doAfterAnonymous = (props) => {
	const { category, home, match, dispatch, cookies } = props;
	if (category.categories.length < 1) {
		const selectedSegment = home.segmen.find(e => e.key === match.params.categoryLvl1);
		dispatch(new categoryActions.getCategoryMenuAction(cookies.get(CONST.COOKIE_USER_TOKEN), selectedSegment.id, selectedSegment));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(SubCategory, doAfterAnonymous)));
