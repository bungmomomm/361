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
	Navigation,
	Spinner
} from '@/components/mobile';
import { actions as categoryActions } from '@/state/v4/Category';
import Shared from '@/containers/Mobile/Shared';
import CONST from '@/constants';
import { actions as sharedActions } from '@/state/v4/Shared';
import { urlBuilder } from '@/utils';

const buildUrl = (stringCategory = '') => {
	return stringCategory.replace(/[^a-zA-Z ]/g, '').replace(/\s\s+/g, ' ').replace(/ /g, '-').toLowerCase();
};

class SubCategory extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.source = this.props.cookies.get('user.source');
		this.state = {
			selectedCategory: null
		};
	}

	componentWillMount() {
		if (this.props.category.sub_category === null && this.props.category.categories.length < 1) {
			return this.props.history.push('/category');
		}

		this.setSelectedCategory(this.props.category.categories);

		return true;
	}

	setSelectedCategory(categories) {
		const selectedCategory = categories.filter(e => e.id === this.props.category.sub_category)[0];
		if (selectedCategory) {

			const categorySlug = encodeURIComponent(buildUrl(selectedCategory.title));

			if (selectedCategory.sub_categories.length === 0) {
				this.props.history.push(`/p-${selectedCategory.id}/${categorySlug}`);
			}
			this.getFeaturedBrands(selectedCategory.id);
			this.setState({ selectedCategory });
		}

		if (selectedCategory === undefined) {
			this.props.history.push('/category');
		}
		return true;
	}

	getFeaturedBrands(categoryId) {
		const { dispatch } = this.props;
		dispatch(new categoryActions.getBrandsByCategoryIdAction(this.userCookies, categoryId));
	}

	renderListCategory() {
		const { dispatch } = this.props;
		return (this.state.selectedCategory) && this.state.selectedCategory.sub_categories.map((cat, key) => {
			return (
				<List key={key}>
					<Link
						style={{ flexFlow: 'row nowrap' }}
						to={urlBuilder.setId(cat.id).setName(cat.title).buildPcp()}
						onClick={
							() => {
								dispatch(new sharedActions.removeLogSinglePage());
							}
						}
					>
						<List.Image><Image width={40} height={40} avatar src={cat.image_url} /></List.Image>
						<List.Content>{cat.title}</List.Content>
					</Link>
				</List>
			);
		});
	}

	renderFeaturedBrands(categoryName) {
		return (this.props.category.brands.length > 0)
			&& this.props.category.brands.map((brand, key) => {
				return (
					<List key={key}>
						<Link
							style={{ flexFlow: 'row nowrap' }}
							to={urlBuilder.setId(brand.id).setCategoryId(this.state.selectedCategory.id).setName(categoryName).buildFeatureBrand()}
						>
							<List.Image><Image width={40} height={40} avatar src={brand.image_url} /></List.Image>
							<List.Content>{brand.title}</List.Content>
						</Link>
					</List>
				);
			}
		);
	}

	render() {
		const { selectedCategory } = this.state;
		const HeaderPage = (selectedCategory) && ({
			left: (
				<Link to={'/category'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: selectedCategory.title || '',
			right: null
		});

		const loadingDisplay = (<div style={{ textAlign: 'center', padding: '20px 0px' }} > <Spinner /> </div>);

		return (
			<div style={this.props.style}>
				<Page>
					{
						this.props.category.loading ? loadingDisplay :
							(<div>
								<Divider>Shop by Products</Divider>
								{this.renderListCategory()}
							</div>)
					}
					{
						this.props.category.brands.length > 0 && (
							<div>
								<Divider>Featured Brands</Divider>
								{this.renderFeaturedBrands(selectedCategory.title)}
							</div>
						)
					}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Categories' scroll={this.props.scroll} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		home: state.home,
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Shared(SubCategory)));
