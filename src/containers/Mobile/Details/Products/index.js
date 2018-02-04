import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as productActions } from '@/state/v4/Product';
import { actions as commentActions } from '@/state/v4/Comment';
import { Page, Header, Navigation, Level, Button, Svg, Card } from '@/components/mobile';
// import styles from './products.scss';

class Products extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}
	

	componentDidMount() {
		const { dispatch, match } = this.props;
		dispatch(new productActions.productDetailAction(this.userCookies, match.params.id));
		dispatch(new productActions.productRecommendationAction(this.userCookies));
		dispatch(new productActions.productSimilarAction(this.userCookies));
		dispatch(new productActions.productSocialSummaryAction(this.userCookies));
		dispatch(new commentActions.productCommentAction(this.userCookies));
	}

	addComment() {
		const { dispatch } = this.props;
		dispatch(new commentActions.commentAddAction(this.userCookies));		
	}

	render() {
		const { product } = this.props;
		const productDetail = product.detail;
		const HeaderPage = {
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
		return (
			<div>
				<Page>
					<div style={{ marginTop: '-60px' }}>
						<h1>{productDetail.brand_name}</h1>
						<div> {productDetail.description} </div>
						<Card.Lovelist />
						<Level style={{ borderBottom: '1px solid #D8D8D8', borderTop: '1px solid #D8D8D8' }}>
							<Level.Left className='flex-center'>
								<Svg src='ico_ovo.svg' />
							</Level.Left>
							<Level.Item>
								<div style={{ marginLeft: '15px' }} className='padding--small'>Point: 300.000</div>
							</Level.Item>
							<Level.Right>
								<Button>
									<Svg src='ico_warning.svg' />
								</Button>
							</Level.Right>
						</Level>
						<div className='flex-row flex-center margin--medium'>
							<Button style={{ width: '40px' }} color='secondary' outline size='medium'>XL</Button>
							<Button style={{ width: '40px' }} color='secondary' outline size='medium'>XL</Button>
							<Button style={{ width: '40px' }} color='secondary' outline size='medium'>XL</Button>
							<Button style={{ width: '40px' }} color='secondary' outline size='medium'>XL</Button>
							<Button style={{ width: '40px' }} color='secondary' disabled outline size='medium'>XL</Button>
							<Button style={{ width: '40px' }} color='secondary' size='medium'>XL</Button>
						</div>
						<button onClick={() => this.addComment()}> add comment </button>
					</div>
				</Page>
				<Header.Modal style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }} {...HeaderPage} />
				<Navigation />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Products));
