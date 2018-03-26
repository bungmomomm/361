import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header,
	Button,
	Input,
	Divider,
	Svg,
	Page,
	List,
	Navigation,
	Level,
	Spinner,
	SEO
} from '@/components/mobile';
import C from '@/constants';
import styles from './brands.scss';
import { actions } from '@/state/v4/Brand';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Shared from '@/containers/Mobile/Shared';
import { urlBuilder } from '@/utils';
import { userToken, userRfToken, userSource } from '@/data/cookiesLabel';

class Brands extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			minimumLetter: 1,
			searchFocus: false,
			filteredBrand: [],
			keyword: ''
		};
		this.userCookies = this.props.cookies.get(userToken);
		this.userRFCookies = this.props.cookies.get(userRfToken);
		this.source = this.props.cookies.get(userSource);
		this.headContainer = null;

		this.onAlphabetsClick = (id) => {
			const section = document.getElementById(String(id.trim()));
			document.body.scrollTop = section.offsetTop;
		};
	}

	componentDidMount() {
		const { dispatch, category } = this.props;
		dispatch(new actions.brandListAction(this.userCookies, category.activeSegment.id));
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, category } = this.props;
		if (this.props.shared.serviceUrl !== nextProps.shared.serviceUrl) {
			dispatch(new actions.brandListAction(this.userCookies, category.activeSegment.id));
		}
	}

	onFilter(keyword) {
		let filteredBrand = [];

		if (keyword.length >= this.state.minimumLetter) {
			this.props.brands.brand_list.map((e) => {
				const listBrand = e.brands.filter((list) => {
					const keywordDisplay = list.facetdisplay.toLowerCase();
					if (keywordDisplay.indexOf(keyword.toLowerCase()) >= 0) {
						filteredBrand.push(list);
					}
					return list;
				});
				return listBrand;
			});
			filteredBrand = filteredBrand.sort((a, b) => b.count - a.count);
		}

		this.setState({
			filteredBrand,
			keyword
		});
	}

	onChange(current) {
		const keyword = current.currentTarget.value;
		this.onFilter(keyword);
	}

	onFocus() {
		this.setState({
			searchFocus: true
		});
	}

	onBlur(e) {
		this.setState({
			searchFocus: false
		});
		if (e.relatedTarget && e.relatedTarget.id === 'cancelSearch') {
			this.cancelSearch();
		}
	}

	cancelSearch() {
		this.setState({
			keyword: '',
			filteredBrand: []
		});
	}

	renderFilterAlphabets() {
		const { brands } = this.props;
		return (this.props.brands.brand_list) ? (
			this.state.keyword.length < this.state.minimumLetter &&
			<div className={styles.listFilterKey}>
				{C.FILTER_KEY.map((key, id) => {
					const brandExist = brands.brand_list.filter(e => e.group === key.trim());
					const disabled = brandExist.length < 1;
					// const link = `#${key.trim()}`;

					return (
						<Button
							key={id}
							onClick={() => { this.onAlphabetsClick(key); }}
							disabled={disabled}
						>
							{
								disabled ? <strike>{key}</strike> : <b>{key}</b>
							}
						</Button>
					);
				})}
			</div>
		) : '';
	}

	renderBrandByAlphabets() {
		const { brands } = this.props;
		return (this.props.brands.brand_list) ? (
			this.state.keyword.length < this.state.minimumLetter &&
			brands.brand_list.length > 0 &&
			brands.brand_list.map((list, id) => {
				return (
					<div key={id} id={list.group} className='margin--medium-v'>
						<Divider className='margin--none-t margin--none-r' size='small'>
							{list.group}
						</Divider>
						{
							list.brands.length > 0 &&
							list.brands.map((b, i) => {
								return (
									<List key={i}>
										<Link to={urlBuilder.setId(Number(b.facetrange)).setName(b.facetdisplay).buildBrand()}>
											<List.Content>
												<p className='margin--medium-v'>
													<span>{ b.facetdisplay.replace(/\b\w/g, (l) => (l.toUpperCase())) }</span>&nbsp;
													<span style={{ color: 'grey' }} >({b.count})</span>
												</p>
											</List.Content>
										</Link>
									</List>
								);
							})
						}
					</div>
				);
			})
		) : '';
	}

	renderBrandBySearch() {
		return (this.props.brands.brand_list) ? (
			this.state.keyword.length >= this.state.minimumLetter &&
			this.state.filteredBrand.map((brand, key) => {
				return (
					<List key={key}>
						<Link to={urlBuilder.setId(brand.facetrange).setName(brand.facetdisplay).buildBrand()}>
							<List.Content>{brand.facetdisplay} <text style={{ color: 'grey' }} >({brand.count})</text></List.Content>
						</Link>
					</List>
				);
			})
		) : '';
	}

	render() {
		const { shared, dispatch, brands } = this.props;

		const HeaderPage = {
			left: (
				<Link to='/category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Brands',
			right: null,
			subHeaderStyle: {
				height: this.headContainer && this.headContainer.getBoundingClientRect().height
			},
			rows: [{
				left: null,
				center: (
					<div className={styles.filter}>
						<Level>
							<Level.Item className={styles.center}>
								<Input
									autoFocus
									iconLeft={<Svg src='ico_search.svg' />}
									placeholder='cari nama brand'
									onFocus={() => this.onFocus()}
									onBlur={(e) => this.onBlur(e)}
									onChange={(e) => this.onChange(e)}
									value={this.state.keyword}
								/>
							</Level.Item>
							{
								(this.state.keyword.length >= this.state.minimumLetter ||
								this.state.searchFocus) &&
								<Level.Right className={styles.right}>
									<Button className={styles.cancelButton} id='cancelSearch' onClick={() => this.cancelSearch()}> BATAL</Button>
								</Level.Right>
							}
						</Level>
						{ !brands.brand_list && (<div style={{ paddingTop: '20px' }}> <Spinner /></div>)}
						{ this.renderFilterAlphabets() }
					</div>
				),
				right: null
			}]
		};

		return (
			<div style={this.props.style}>
				<Page color='white'>
					<SEO
						paramCanonical={process.env.MOBILE_UR}
					/>
					{
						<ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />
					}
					{ this.renderBrandBySearch() }
					{ this.renderBrandByAlphabets() }
				</Page>
				<Header.Modal {...HeaderPage} headerRef={(header) => { this.headContainer = header; }} />
				{/* <Header.Modal {...HeaderPage} /> */}
				<Navigation active='Categories' scroll={this.props.scroll} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		brands: state.brands,
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Brands)));
