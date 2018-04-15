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
import Shared from '@/containers/Mobile/Shared';
import { urlBuilder } from '@/utils';
import { userToken, userSource, pageReferrer, isLogin } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';
import _ from 'lodash';

@handler
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
		this.source = this.props.cookies.get(userSource);
		this.headContainer = null;
		this.inputElement = null;
		this.isLogin = this.props.cookies.get(isLogin) === 'true';
		this.onAlphabetsClick = (id) => {
			const section = document.getElementById(String(id.trim()));
			const sUsrAg = window.navigator.userAgent;
			if (sUsrAg.indexOf('UCBrowser') > -1) {
				document.body.scrollTop = section.offsetTop - 70;
			} else if ((sUsrAg.indexOf('Chrome') > -1) || (sUsrAg.indexOf('Firefox') > -1)) {
				document.body.parentNode.scrollTop = section.offsetTop - 70;
			} else {
				document.body.scrollTop = section.offsetTop - 70;
			}
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.brands !== nextProps.brands || this.state !== nextState;
	}

	onFilter = (keyword) => {
		let filteredBrand = [];

		if (keyword.length >= this.state.minimumLetter) {
			window.scrollTo(0, 0);
			this.props.brands.brand_list_flat.filter((list) => {
				const keywordDisplay = list.facetdisplay.toLowerCase();
				if (keywordDisplay.indexOf(keyword.toLowerCase()) >= 0) {
					filteredBrand.push(list);
				}
				return list;
			});
			filteredBrand = filteredBrand.sort((a, b) => b.count - a.count);
		}

		this.setState({
			filteredBrand,
			keyword
		});
	};

	onChange = (current) => {
		const keyword = current.target.value;
		this.onFilter(keyword);
	};

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


	debounce = (...args) => {
		const debounced = _.debounce(...args);
		return (e) => {
			e.persist();
			return debounced(e);
		};
	};

	cancelSearch() {
		this.inputElement.value = '';
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
				<div className={styles.perline}>
					{C.FILTER_KEY.map((key, id) => {
						if (id > 12) return '';
						const brandExist = brands.brand_list.filter(e => e.group === key.trim());
						const disabled = brandExist.length < 1;
						return (
							<Button
								key={id}
								onClick={() => { this.onAlphabetsClick(key); }}
								disabled={disabled}
							>
								{
									disabled ? <strike>{key}</strike> : key
								}
							</Button>
						);
					})}
				</div>
				<div className={styles.perline}>
					{C.FILTER_KEY.map((key, id) => {
						if (id <= 12) return '';
						const brandExist = brands.brand_list.filter(e => e.group === key.trim());
						const disabled = brandExist.length < 1;
						return (
							<Button
								key={id}
								onClick={() => { this.onAlphabetsClick(key); }}
								disabled={disabled}
							>
								{
									disabled ? <strike>{key}</strike> : key
								}
							</Button>
						);
					})}
				</div>
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
						<Divider className='margin--none-t margin--none-r' size='small' style={{ margin: 0 }}>
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
							<List.Content>
								<p className='margin--medium-v'>
									{brand.facetdisplay} <text style={{ color: 'grey' }} >({brand.count})</text>
								</p>
							</List.Content>
						</Link>
					</List>
				);
			})
		) : '';
	}

	render() {
		const { shared, brands, cookies } = this.props;
		const navigationAttribute = {
			scroll: this.props.scroll
		};
		navigationAttribute.active = cookies.get(pageReferrer);

		const iconRight = {
			iconRight: this.state.keyword !== '' && (
				<button onClick={() => {
					this.inputElement.focus();
					this.inputElement.value = '';
					this.onFilter('');
					this.setState({ ...this.state.keyword, keyword: '', searchFocus: true });
				}}
				>
					<Svg src='ico_close-grey.svg' />
				</button>)
		};

		const HeaderPage = {
			left: (
				<Link to='/category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Brands',
			right: null,
			subHeaderStyle: {
				height: 'auto',
				minHeight: '60px'
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
									{...iconRight}
									placeholder='cari nama brand'
									onFocus={() => this.onFocus()}
									onBlur={(e) => this.onBlur(e)}
									onChange={this.debounce(this.onChange, 500)}
									inputRef={(el) => { this.inputElement = el; }}
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
				),
				right: null
			}]
		};

		return (
			<div style={this.props.style}>
				<Page color='white'>
					<SEO
						paramCanonical={`${process.env.MOBILE_URL}${location.pathname}`}
					/>
					{ !brands.brand_list && (<div style={{ padding: '20px 0' }}> <Spinner /></div>)}
					{ this.renderBrandBySearch() }
					{ this.renderBrandByAlphabets() }
				</Page>
				<Header.Modal {...HeaderPage} headerRef={(header) => { this.headContainer = header; }} />
				{/* <Header.Modal {...HeaderPage} /> */}
				<Navigation {...navigationAttribute} totalCartItems={shared.totalCart} botNav={this.props.botNav} isLogin={this.isLogin} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.category,
		brands: state.brands,
		shared: state.shared,
		home: state.home
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, shared, home } = props;
	const activeSegment = home.segmen.filter((e) => e.key === shared.current)[0];
	await dispatch(new actions.brandListAction(cookies.get(userToken), activeSegment.id));
};

export default withCookies(connect(mapStateToProps)(Shared(Brands, doAfterAnonymous)));
