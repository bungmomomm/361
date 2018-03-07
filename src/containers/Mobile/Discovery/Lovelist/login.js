import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Header, Page, Button, Svg, Level } from '@/components/mobile';
import styles from './lovelist.scss';

class LovelistLogin extends Component {
	constructor(props) {
		super(props);
		this.props = props;
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
				<Page>
					<div className={styles.lovelistLogin} style={{ backgroundImage: `url(${loginBg})` }}>
						<Svg width='50px' height='50px' style={{ justifyContent: 'center' }} src='ico_home-white.svg' />
						<p className='margin--medium' style={{ color: '#fff' }}>Unlock the Full Experience</p>
						<Level className='margin--medium'>
							<Level.Left>&nbsp;</Level.Left>
							<Level.Item>
								<p className='margin--small'><Button wide size='medium' color='secondary'>LOGIN</Button></p>
								<p className='margin--small'><Button wide outline size='medium' color='transparent'>DAFTAR</Button></p>
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
