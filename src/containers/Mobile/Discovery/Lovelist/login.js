import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Header, Page, Button, Svg, Level } from '@/components/mobile';
import styles from './lovelist.scss';
import cookiesLabel from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class LovelistLogin extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = (typeof this.props.cookies.get(cookiesLabel.isLogin) === 'string' && this.props.cookies.get(cookiesLabel.isLogin) === 'true');
		this.redirectToPage = this.redirectToPage.bind(this);
	}

	componentWillMount() {
		if (this.isLogin) {
			const { history } = this.props;
			history.push('/lovelist');
		}
	}

	redirectToPage(page = '') {
		const { history } = this.props;
		let destUri = null;

		switch (page) {
		case 'home':
			destUri = '/';
			break;
		case 'carts':
			destUri = '/cart';
			break;
		case 'register':
		case 'login':
			destUri = '/login?redirect_uri=/lovelist';
			break;
		default:
			break;
		}

		if (destUri !== null) {
			history.push(destUri);
		}
	}

	render() {
		const loginBg = require('@/assets/images/bg-wardrobe.png');
		const HeaderPage = {
			left: null,
			center: 'Lovelist',
			right: (<Link to='/'><Svg src='ico_arrow-back.svg' /></Link>)
		};
		return (
			<div>
				<Page style={{ marginTop: '-60px' }}>
					<div className={styles.lovelistLogin} style={{ backgroundImage: `url(${loginBg})` }}>
						<Svg width='50px' height='50px' style={{ justifyContent: 'center' }} src='ico_home-white.svg' />
						<p className='margin--medium' style={{ color: '#fff' }}>Unlock the Full Experience</p>
						<Level className='margin--medium'>
							<Level.Left>&nbsp;</Level.Left>
							<Level.Item>
								<p className='margin--small'><Button onClick={() => this.redirectToPage('login')} wide size='large' color='secondary'>LOGIN</Button></p>
								<p className='margin--small'><Button onClick={() => this.redirectToPage('login')} wide outline size='large' color='transparent'>DAFTAR</Button></p>
							</Level.Item>
							<Level.Right>&nbsp;</Level.Right>
						</Level>
					</div>
				</Page>
				<Header.Modal transparent {...HeaderPage} />
			</div>
		);
	}
}

export default withCookies(LovelistLogin);
