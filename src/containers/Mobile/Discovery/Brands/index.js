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
	Level
} from '@/components/mobile';
import C from '@/constants';
import styles from './brands.scss';
import { actions } from '@/state/v4/Brand';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';

class Brands extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			minimumLetter: 1,
			searchFocus: false,
			filteredBrand: [],
			keyword: '',
			notification: {
				show: true
			}
		};
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		const { dispatch, category } = this.props;
		dispatch(new actions.brandListAction(this.userCookies, category.segment));
	}

	onFilter(keyword) {
		let filteredBrand = [];
		
		if (keyword.length >= this.state.minimumLetter) {
			this.props.brands.data.map((e) => {
				const listBrand = e.brands.filter((list) => {
					if (list.facetdisplay.indexOf(keyword) >= 0) {
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
		return (
			this.state.keyword.length < this.state.minimumLetter &&
			<div className={styles.listFilterKey}>
				{C.FILTER_KEY.map((key, id) => {
					const brandExist = brands.data.filter(e => e.group === key.trim());
					const disabled = brandExist.length < 1;
					const link = `#${key.trim()}`;
					
					return (
						<Button
							key={id}
							onClick={() => { window.location.href = link; }}
							disabled={disabled}
						>
							{
								disabled ? <strike>{key}</strike> : <b>{key}</b>
							}
						</Button>
					);
				})}
			</div>
		);
	}

	renderBrandByAlphabets() {
		const { brands } = this.props;
		
		return (
			this.state.keyword.length < this.state.minimumLetter &&
			brands.data.length > 0 &&
			brands.data.map((list, id) => {
				return (
					<div key={id} id={list.group}>
						<Divider className='margin--none' size='small'>
							{list.group}
						</Divider>
						{
							list.brands.length > 0 &&
							list.brands.map((b, i) => {
								return (
									<List key={i}>
										<Link to={`/brand/${b.facetrange}`}>
											<List.Content>{b.facetdisplay} <text style={{ color: 'grey' }} >({b.count} produk)</text></List.Content>
										</Link>
									</List>
								);
							})
						}
					</div>
				);
			})
		);
	}

	renderBrandBySearch() {
		return (
			this.state.keyword.length >= this.state.minimumLetter &&
			this.state.filteredBrand.map((brand, key) => {
				return (
					<List key={key}>
						<Link to={`/brand/${brand.facetrange}`}>
							<List.Content>{brand.facetdisplay} <text style={{ color: 'grey' }} >({brand.count})</text></List.Content>
						</Link>
					</List>
				);
			})
		);
	}

	render() {
		const HeaderPage = {
			left: (
				<Link to='/category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Brands',
			right: null
		};
		const { shared } = this.props;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });
		return (
			<div style={this.props.style}>
				<Page>
					{
						<ForeverBanner {...foreverBannerData} />
					}
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
						{ this.renderFilterAlphabets() }
					</div>
					{ this.props.brands.loading ? 'Loading...' : '' }
					{ this.renderBrandBySearch() }
					{ this.renderBrandByAlphabets() }
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
		brands: state.brands,
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Brands));