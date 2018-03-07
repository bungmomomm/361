import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
// import { connect } from 'react-redux';
// import { actions as hashtagActions } from '@/state/v4/Hashtag';
// import { Header, Page, Navigation, Svg, Grid } from '@/components/mobile';
import { Page, Header, Svg, Button, Image, Grid } from '@/components/mobile';

import { Link } from 'react-router-dom';

class Hashtags extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gridSizeSmall: true
		};
	}

	renderGridSmall() {
		console.log(this);
		return (
			<Grid bordered split={3}>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
				<div><Image local src='temp/thumb-1.jpg' /></div>
			</Grid>
		);
	}

	renderGridLarge() {
		console.log(this);
		return (
			<div>
				<div>
					<Image local src='temp/product-1.jpg' width='100%' />
					<div className='flex-row padding--medium-h margin--medium-h'>
						<div><Image avatar height={40} width={40} local src='temp/pp.jpg' /></div>
						<div className='padding--medium-h'>
							<div><Link className='font-color--primary' to='/'>@vinensiuswibowo</Link></div>
							<div><em className='font-small font--lato-normal font-color--grey'>Post date: 13/12/2017</em></div>
						</div>
					</div>
				</div>
				<div>
					<Image local src='temp/product-1.jpg' width='100%' />
					<div className='flex-row padding--medium-h margin--medium-v'>
						<div><Image avatar height={40} width={40} local src='temp/pp.jpg' /></div>
						<div className='padding--medium-h'>
							<div><Link className='font-color--primary' to='/'>@vinensiuswibowo</Link></div>
							<div><em className='font-small font--lato-normal font-color--grey'>Post date: 13/12/2017</em></div>
						</div>
					</div>
				</div>
				<div>
					<Image local src='temp/product-1.jpg' width='100%' />
					<div className='flex-row padding--medium-h margin--medium-v'>
						<div><Image avatar height={40} width={40} local src='temp/pp.jpg' /></div>
						<div className='padding--medium-h'>
							<div><Link className='font-color--primary' to='/'>@vinensiuswibowo</Link></div>
							<div><em className='font-small font--lato-normal font-color--grey'>Post date: 13/12/2017</em></div>
						</div>
					</div>
				</div>
			</div>
		);
	}


	render() {
		const HeaderPage = {
			left: (
				<Link to='/brandcategory'>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: '#MauGayaItuGampang',
			right: (
				<Button onClick={() => this.setState({ gridSizeSmall: !this.state.gridSizeSmall })}>
					<Svg src={this.state.gridSizeSmall ? 'ico_three-line.svg' : 'ico_grid.svg'} />
				</Button>
			)
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div className='margin--medium-v text-center padding--large-h'>
						Upload gaya OOTD kamu di Instagram dengan hashtag #MauGayaItuGampang dan menangin kesempatan tampil di MatahariMall.com!
					</div>
					<div className='flex-row flex-center flex-spaceBetween margin--medium-v padding--large-h'>
						<Link to='/'>All</Link>
						<Link to='/'>#MDSMens</Link>
						<Link to='/'>#MDSWomens</Link>
						<Link to='/'>#MDSKids</Link>
					</div>
					{
						this.state.gridSizeSmall ? this.renderGridSmall() : this.renderGridLarge()
					}
					<div className='flex-center padding--medium-h margin--large-v'>
						<Button color='secondary' size='medium' style={{ width: '200px' }} outline>LOAD MORE</Button>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

export default withCookies(Hashtags);
