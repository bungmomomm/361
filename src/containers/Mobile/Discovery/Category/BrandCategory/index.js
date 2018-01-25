import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
// import _ from 'lodash';
import {
	Header,
	Button,
	Input,
	Divider,
	Svg,
	Page,
	List,
	Navigation
} from '@/components/mobile';
import C from '@/constants';
import styles from './brandCategory.scss';
import { actions } from '@/state/v4/Brand';

class BrandCategory extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			minimumLetter: 3,			
			searchFocus: false,
			filteredBrand: [],
			keyword: '',
		};
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(new actions.brandListAction({ token: this.userCookies }));
	}

	onFilter(keyword) {
		let filteredBrand = [];		
		
		if (keyword.length >= this.state.minimumLetter) {
			console.log(keyword.length);
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
										<Link to='/catalogcategory'>
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
						<Link to='/catalogcategory'>
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
		
		return (
			<div style={this.props.style}>
				<Page>
					<div className={styles.filter}>
						<div>
							<div className={styles.center}>
								<Input
									autoFocus
									iconLeft={<Svg src='ico_search.svg' />}
									placeholder='cari nama brand'
									onFocus={() => this.onFocus()}
									onBlur={(e) => this.onBlur(e)}
									onChange={(e) => this.onChange(e)}
									value={this.state.keyword}
								/>
							</div>
							{
								(this.state.keyword.length >= this.state.minimumLetter ||
								this.state.searchFocus) &&
								<div className={styles.right}>
									<Button className={styles.cancelButton} id='cancelSearch' onClick={() => this.cancelSearch()}> BATAL</Button>
								</div>
							}
						</div>
						{ this.renderFilterAlphabets() }
					</div>
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
		...state
	};
};

export default withCookies(connect(mapStateToProps)(BrandCategory));