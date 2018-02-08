import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header,
	// Tabs,
	Divider,
	Svg,
	Page,
	List,
	Image,
	Navigation
} from '@/components/mobile';
import { actions as categoryActions } from '@/state/v4/Category';
// import * as C from '@/constants';
// import styles from './subCategory.scss';

class SubCategory extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			category: {}
		};

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		this.setParentCategory();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.category.data.length < 1 && nextProps.category.data.length > 0) {
			this.setParentCategory(nextProps);
		}
	}

	setParentCategory(props = this.props) {
		const categoryId = props.match.params.categoryId;
		const category = props.category.data.filter(e => e.id === categoryId)[0];
		if (category) {
			this.setState({
				category
			});
		} else {
			const { dispatch } = this.props;
			// change action if there is any endpoint for subcategory
			dispatch(new categoryActions.getCategoryMenuAction(this.userCookies));
		}
	}

	render() {
		const { category } = this.state;
		const HeaderPage = {
			left: (
				<Link to='/category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			), 
			center: category.title || '',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					<Divider>Shop by Products</Divider>
					{ this.props.category.loading ? 'Loading...' : '' }
					{
						category.sub_categories && 
						category.sub_categories.map((cat, key) => {
							const categorySlug = cat.title.replace(/ /g, '-').toLowerCase();
							
							return (
								<List key={key}>
									<Link to={`/p-${cat.id}/${categorySlug}`}>
										<List.Image><Image width={40} height={40} avatar src={cat.image_url} /></List.Image>
										<List.Content>{cat.title}</List.Content>
									</Link>
								</List>
							);
						})
					}
					<Divider>Featured Brands</Divider>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
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
	};
};

export default withCookies(connect(mapStateToProps)(SubCategory));