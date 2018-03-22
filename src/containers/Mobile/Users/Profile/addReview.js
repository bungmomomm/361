import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import {
	Header,
	Svg,
	Page,
	Level,
	Button,
	Input,
	Image,
	Modal,
	RatingAdd
} from '@/components/mobile';
import CONST from '@/constants';
import { actions as userAction } from '@/state/v4/User';
import styles from './profile.scss';
import classNames from 'classnames';

class AddReview extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get('isLogin');
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.soNumber = this.props.match.params.so_number;
		this.state = {
			payload: {
				product_id: null,
				product_variant_id: null,
				so_store_number: null,
				subject: null,
				review: null,
				product_rating: null,
				seller_rating: null,
			},
			isSubmiting: false,
			isSubmitSuccess: false
		};

		if (this.isLogin !== 'true') {
			this.props.history.push('/');
		}
	}

	componentWillMount() {
		if ('serviceUrl' in this.props.shared) {
			if (!this.props.user.reviewInfo) {
				return this.props.history.push('/profile/my-order/');
			}

			const { reviewInfo } = this.props.user;
			const payload = {
				...this.state.payload,
				product_id: reviewInfo.item.product_id,
				product_variant_id: reviewInfo.item.product_variant_id,
				so_store_number: reviewInfo.soStoreNumber
			};
			this.setState({ payload });
		}
		return true;
	}

	componentWillReceiveProps(nextProps) {
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			if (!nextProps.user.reviewInfo) {
				this.props.history.push('/profile/my-order/');
			}
		}

	}

	onSubmitReview() {
		const { dispatch } = this.props;
		this.setState({ isSubmiting: true });
		const submiting = new Promise((resolve, reject) => resolve(
			dispatch(userAction.submitReview(this.userToken, this.state.payload))
		));
		submiting.then((res) => {
			this.setState({ isSubmiting: false, isSubmitSuccess: true });
			setTimeout(() => {
				this.props.history.goBack();
			}, 2000);
		}).catch((err) => this.setState({ isSubmiting: false }));
	}

	render() {
		const { reviewInfo } = this.props.user;
		const HeaderPage = ({
			left: (
				<span
					onClick={() => this.props.history.goBack()}
					role='button'
					tabIndex='0'
				>
					<Svg src='ico_arrow-back-left.svg' />
				</span>
			),
			center: 'Ulasan',
			right: null,
		});
		const className = classNames('sellerReviewInfo');
		return (
			<div style={this.props.style}>
				<Page>
					<Level>
						<Level.Left>
							Penilaian Penjual
						</Level.Left>
					</Level>
					<Level className='bg--white flex-center text-center'>
						<div className='padding--small-h '>
							<div style={{ marginBottom: '10px' }}>
								<Image avatar width={60} height={60} src={reviewInfo.seller.seller_avatar} />
							</div>
							<div className={`font--lato font-medium ${className}`}>
								<strong>{reviewInfo.seller.seller}</strong>
							</div>
							<div className={styles.sellerReviewInfo}>
								Jadikan ulasanmu lebih bermanfaat
							</div>
							<div className={styles.sellerReviewInfo}>
								<RatingAdd name='seller' active='3' total='5' />
							</div>
						</div>
					</Level>
					<Level>
						<Level.Left>
							Ulasan Produk
						</Level.Left>
					</Level>
					<Level className='bg--white'>
						<Level.Left>
							<Image width={60} height={77} src={reviewInfo.item.images[0].thumbnail} />
						</Level.Left>
						<Level.Item>
							<span className='margin--small text-uppercase'>{reviewInfo.item.brand.name}</span>
							<span className='margin--small font-color--primary-ext-2'>{reviewInfo.item.product_title}</span>
							<span className='margin--small'><RatingAdd name='product' active='3' total='5' /></span>
						</Level.Item>
						<Level.Right>
							<strong>{reviewInfo.item.pricing.formatted.price}</strong>
						</Level.Right>
					</Level>
					<div style={{
						textAlign: 'center',
						padding: '0px 25px',
						marginTop: '10px',
						backgroundColor: 'white'
					}}
					>
						<div >
							<Input
								label='Judul ulasan anda (Opsional)'
								type='text'
								placeholder=''
								flat
								onChange={(event) => {
									const payload = { ...this.state.payload, subject: event.target.value };
									this.setState({ ...this.state, payload });
								}}
							/>
						</div>
						<div>
							<Input
								label='Ceritakan kepuasan dan kesesuaian produk yang anda beli atau terima'
								type='text'
								placeholder=''
								flat
								onChange={(event) => {
									const payload = { ...this.state.payload, review: event.target.value };
									this.setState({ ...this.state, payload });
								}}
							/>
						</div>
					</div>
					<Level className='bg--white'>
						<Button rounded disabled={this.state.isSubmiting} size='medium' color='secondary' onClick={() => this.onSubmitReview()}>Kirim</Button>
					</Level>
					<Level>
						<div>*Upload barang tersebut (jpeg, jpg, png) maksimal 5 foto</div>
					</Level>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Modal show={this.state.isSubmitSuccess}>
					<div className='font-medium'>
						<h3 className='text-center'>Ulasan Diterima</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h'>
								<center>Terima kasih atas penilaian anda</center>
							</Level.Item>
						</Level>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		user: state.users
	};
};

export default withCookies(connect(mapStateToProps)(Shared(AddReview)));
