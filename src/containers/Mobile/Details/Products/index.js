import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { actions as productActions } from '@/state/v4/Product';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { Modal, Page, Header, Navigation, Level, Button, Svg, Card, Comment, Image, Radio, Grid, Carousel, Rating } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import styles from './products.scss';
import SellerProfile from '../../Discovery/Seller/components/SellerProfile';

class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');

		this.handleScroll = this.handleScroll.bind(this);
		this.handleLovelistClick = this.handleLovelistClick.bind(this);
		this.handleImageItemClick = this.handleImageItemClick.bind(this);
		this.handleCancelRemoveItem = this.handleCancelRemoveItem.bind(this);
		this.removeAddItem = this.removeAddItem.bind(this);
		this.setCarouselSlideIndex = this.setCarouselSlideIndex.bind(this);


		this.state = {
			size: 's',
			status: {
				showScrollInfomation: false,
				isLoved: true,
				isZoomed: false,
				showConfirmDelete: false,
				pdpDataHasLoaded: false,
				similarSet: false,
				reviewsSet: false,
			},
			pdpData: {
				cardProduct: {},
				reviewContent: {},
				similarContent: {}
			},
			detail: {},
			carousel: {
				slideIndex: 0
			}
		};
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillReceiveProps(nextProps) {
		const { product, lovelist, dispatch } = nextProps;
		const { detail, socialSummary, similar } = product;
		const { status, pdpData } = this.state;

		// sets pdp main data
		if (!_.isEmpty(detail) && !_.isEmpty(lovelist.bulkieCountProducts) && !status.pdpDataHasLoaded) {
			const lovelistProduct = dispatch(lovelistActions.getProductBulk(5131299));

			detail.totalLovelist = lovelistProduct.total;
			detail.totalComments = socialSummary.comments.total || 0;
			status.pdpDataHasLoaded = true;
			status.loading = false;
			pdpData.cardProduct = productActions.getProductCardData(detail);

			console.log('I am being called once! (Main Data)');
		}

		// sets similar products data
		if (!_.isEmpty(similar) && !status.similarSet) {
			status.similarSet = true;
			pdpData.similarContent = similar.map((item, idx) => {
				const data = {
					productTitle: item.product_title,
					brandName: item.brand,
					pricing: item.pricing,
					images: item.images
				};
				return <Card.CatalogGrid linkToPdp='/' {...data} key={idx} />;
			});
			console.log('I am being called once! (Similar)');
		}

		// sets product reviews data
		if (!_.isEmpty(socialSummary.reviews) && !status.reviewsSet) {
			status.reviewsSet = true;
			pdpData.reviewContent = socialSummary.reviews.summary.map((item, idx) => {
				return (
					<Comment key={idx} type='review' data={item} />
				);
			});
			console.log('I am being called once! (Review)');
		}

		// updates states
		this.setState({ detail, status, pdpData });
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
	}

	setCarouselSlideIndex(index) {
		this.setState({
			carousel: {
				slideIndex: index || 0
			}
		});
	}

	handleScroll(e) {
		const { status } = this.state;
		if (e.target.scrollTop > 400 && !status.showScrollInfomation) {
			status.showScrollInfomation = true;
		}

		if (e.target.scrollTop < 400 && status.showScrollInfomation) {
			status.showScrollInfomation = false;
		}

		this.setState({ status });
	}

	handleLovelistClick(e) {
		const { status } = this.state;
		if (status.isLoved) {
			this.setState({ status });
			status.showConfirmDelete = !status.showConfirmDelete;
		} else {
			this.removeAddItem(e);
		}
	}

	handleCancelRemoveItem(e) {
		const { status } = this.state;
		status.showConfirmDelete = false;
		this.setState({ status });
	}

	handleImageItemClick() {
		this.setState({ status: { isZoomed: true } });
	}

	redirectToComments() {
		const { match, history } = this.props;
		history.push(`/product/comments/${match.params.id}`);
	}

	removeAddItem(e) {
		const { dispatch, match } = this.props;
		const { pdpData, status } = this.state;

		if (!status.isLoved) {
			status.isLoved = true;
			pdpData.cardProduct.totalLovelist += 1;
			dispatch(lovelistActions.addToLovelist(this.userCookies, match.params.id));
		} else {
			status.isLoved = false;
			pdpData.cardProduct.totalLovelist -= 1;
			dispatch(lovelistActions.removeFromLovelist(this.userCookies, match.params.id));
		}

		status.showConfirmDelete = false;
		this.setState({ status, pdpData });
	}

	renderZoomImage() {
		const { carousel, pdpData } = this.state;
		const header = {
			left: (
				<Button onClick={() => this.setState({ status: { isZoomed: false } })} >
					<Svg src={'ico_close-large.svg'} />
				</Button>
			),
			center: '',
			right: ''
		};

		return (
			<div>
				<Carousel
					slideIndex={carousel.slideIndex}
					afterSlide={newSlideIndex => this.setCarouselSlideIndex(newSlideIndex)}
				>
					{
						pdpData.cardProduct.images.map((image, idx) => (
							<div tabIndex='0' role='button' onClick={this.props.onImageItemClick} key={idx} data-img={image.mobile}>
								<Image src={image.mobile} alt='product' />
							</div>
						))
					}
				</Carousel>
				<Header.Modal style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }} {...header} />
			</div>
		);
	}

	renderHeaderPage() {
		const { pdpData, status } = this.state;
		if (status.showScrollInfomation) {
			return {
				left: (
					<a href={history.go - 1}>
						<Svg src={'ico_arrow-back-left.svg'} />
					</a>
				),
				center: <div style={{ width: '220px', margin: '0 auto' }} className='text-elipsis --disable-flex'>{pdpData.cardProduct.product_title}</div>,
				right: (
					<a href={'/'} onClick={this.switchMode}>
						<Svg src={'ico_share.svg'} />
					</a>
				)
			};
		}
		return {
			left: (
				<a href={history.go - 1}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</a>
			),
			center: '',
			right: (
				<a href={'/'} onClick={this.switchMode}>
					<Svg src={'ico_share.svg'} />
				</a>
			)
		};
	}

	renderStickyAction() {
		const { pdpData, status, detail } = this.state;
		if (status.pdpDataHasLoaded && status.showScrollInfomation && !status.loading) {
			return (
				<div className={styles.stickyAction}>
					<Level style={{ padding: '10px' }} className='flex-center'>
						<Level.Left>
							<div className={styles.stickyActionImage}>
								<img alt='product' src={detail.images[0].thumbnail} />
							</div>
						</Level.Left>
						<Level.Item className='padding--medium'>
							<div className='font-normal'>{pdpData.cardProduct.pricing.app_effective_price}</div>
							<div className='font-small font-color--primary-ext-2'>{pdpData.cardProduct.pricing.effective_price}</div>
						</Level.Item>
						<Level.Right>
							<Button color='secondary' size='medium'>BELI AJA</Button>
						</Level.Right>
					</Level>
				</div>
			);
		};
		return null;
	}

	render() {
		const { detail, pdpData, status, carousel } = this.state;
		const { match } = this.props;

		if (status.isZoomed) {
			return this.renderZoomImage();
		}

		return (
			<div>
				<Page>
					<div style={{ marginTop: '-60px', marginBottom: '70px' }}>
						{status.pdpDataHasLoaded && (
							<Card.Product
								setCarouselSlideIndex={this.setCarouselSlideIndex}
								slideIndex={carousel.slideIndex}
								onImageItemClick={this.handleImageItemClick}
								data={pdpData.cardProduct || {}}
								isLoved={status.isLoved}
								onBtnLovelistClick={this.handleLovelistClick}
								onBtnCommentClick={this.redirectToComments}
							/>
						)}
						<div className='flex-center padding--medium border-top'>
							<div className='margin--medium'>
								<div className='flex-row flex-spaceBetween'>
									<div>Pilih Ukuran</div>
									<Link to='/product/guide' className='d-flex font-color--primary-ext-2 flex-row flex-middle'><Svg src='ico_sizeguide.svg' /> <span className='padding--small padding--none-right'>PANDUAN UKURAN</span></Link>
								</div>
								<div className='margin--medium horizontal-scroll margin--none-bottom'>
									<Radio
										name='size'
										checked={this.state.size}
										style={{ marginBottom: '10px' }}
										onChange={(e) => this.setState({ size: e })}
										data={[
											{ label: 'xs', value: 'xs', disabled: true },
											{ label: 's', value: 's' },
											{ label: 'm', value: 'm' },
											{ label: 'l', value: 'l' },
											{ label: 'xl', value: 'xl' },
											{ label: '2xl', value: '2xl' },
											{ label: 's', value: 's' },
											{ label: 'm', value: 'm' },
											{ label: 'l', value: 'l' },
											{ label: 'xl', value: 'xl' },
											{ label: '2xl', value: '2xl' }
										]}
									/>
								</div>
								<p className='font-color--red font-small'>Stock Habis</p>
							</div>
						</div>
						<Level className='font-color--primary-ext-2 border-top border-bottom'>
							<Level.Item>
								<div className='padding--small'>Dapatkan OVO Point: 300.000</div>
							</Level.Item>
							<Level.Right>
								<Button>
									<Svg src='ico_warning.svg' />
								</Button>
							</Level.Right>
						</Level>
						<div className='font-medium margin--medium padding--medium'><strong>Details</strong></div>
						{
							status.pdpDataHasLoaded && <p className='padding--medium' dangerouslySetInnerHTML={{ __html: detail.description }} />
						}
						<span className='margin--small padding--medium'>
							<a>#jualbajubangkok</a> <a>#supplierbangkok</a> <a>#pobkkfirsthand</a> <a>#pobkk</a> <a>#pohk</a> <a>#grosirbaju</a> <a>#premiumquaity</a> <a>#readytowear</a> <a>#ootdindo</a> <a>#olshop</a> <a>#trustedseller</a> <a>#supplierbaju</a> <a>#pochina</a>
						</span>
						<div className='margin--medium --disable-flex padding--medium'>
							<Link to={`/product/comments/${match.params.id}`} className='font--lato-normal font-color--primary-ext-2'>
								{(status.pdpDataHasLoaded && detail.totalComments > 0 ? `Lihat semua ${detail.totalComments} komentar` : 'Belum ada komentar')}
							</Link>
						</div>
						<hr className='margin--small' />
						<div className='margin--small padding--medium font-medium'>Shop the Look</div>
						<div className='flex-row'>{(status.similarSet) ? pdpData.similarContent : 'loading content...'}</div>
						<div style={{ backgroundColor: '#F5F5F5' }}>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--medium'>
									<div className='padding--small margin--small margin--none-top flex-row flex-spaceBetween'>
										<div className='font-medium'>Penilaian Produk</div>
										<Link className='font-small flex-middle d-flex flex-row font-color--primary-ext-2' to='/'><span style={{ marginRight: '5px' }} >LIHAT SEMUA</span> <Svg src='ico_chevron-right.svg' /></Link>
									</div>
									<div className='border-bottom'>
										<div className='padding--small margin--medium margin--none-top flex-row flex-middle'>
											<Rating active='4.5' total={5} />
											<div className='flex-row padding--small'>
												<strong>4.8</strong>/5 <span className='font-color--primary-ext-2 padding--small'>(99 Ulasan)</span>
											</div>
										</div>
									</div>
									{(status.reviewsSet) ? pdpData.reviewContent : 'loading content...'}
								</div>
							</div>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								{
									status.pdpDataHasLoaded && (
										<SellerProfile
											image={detail.seller.seller_logo}
											status='gold'
											isNewStore={false}
											successOrder='95.3'
											rating='4.5'
											totalProduct='1.234'
											name={detail.seller.seller}
											location={detail.seller.seller_location}
											description='Yes brader, kamu sedang ada di halaman profil toko kami. Boleh diintip Collections dan Lists kami.'
										/>
									)
								}
								<div className='margin--medium margin--none-top'>
									<Grid split={4} className='padding--small'>
										<div className='padding--normal'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
										<div className='padding--normal'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
										<div className='padding--normal'><Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' /></div>
										<div className='padding--normal'>
											<Image src='https://cms.souqcdn.com/spring/cms/en/ae/2017_LP/women-clothing/images/women-clothing-skirts.jpg' />
											<div className={styles.seeAll}>
												SEE ALL
											</div>
										</div>
									</Grid>
								</div>
							</div>
							<div className='padding--small' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
								<div className='margin--small padding--medium font-medium'>Produk Serupa</div>
								<div className='flex-row'>{(status.similarSet) ? pdpData.similarContent : 'loading content...'}</div>
							</div>
						</div>
					</div>
					{this.renderStickyAction()}
				</Page>
				<Header.Modal style={!status.showScrollInfomation ? { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' } : {}} {...this.renderHeaderPage()} />
				<Modal show={status.showConfirmDelete}>
					<div className='font-medium'>
						<h3>Hapus Lovelist</h3>
						<Level style={{ padding: '0px' }} className='margin--medium'>
							<Level.Left />
							<Level.Item className='padding--medium'>
								<div className='font-small'>Kamu yakin mau hapus produk ini dari Lovelist kamu?</div>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button onClick={this.handleCancelRemoveItem}>
								<span className='font-color--primary-ext-2'>BATALKAN</span>
							</Button>)}
						confirmButton={(<Button onClick={this.removeAddItem}>YA, HAPUS</Button>)}
					/>
				</Modal>
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		product: state.product,
		shared: state.shared,
		lovelist: state.lovelist
	};
};

const doAfterAnonymous = (props) => {
	const { dispatch, match, cookies } = props;

	const productId = _.toInteger(match.params.id);
	const token = cookies.get('user.token');

	dispatch(new productActions.productDetailAction(token, productId));
	// dispatch(new productActions.productRecommendationAction(token));
	dispatch(new productActions.productSimilarAction(token));
	dispatch(new productActions.productSocialSummaryAction(token, productId));
	dispatch(new lovelistActions.bulkieCountByProduct(cookies.get('user.token'), productId));

};

export default withCookies(connect(mapStateToProps)(Shared(Products, doAfterAnonymous)));
