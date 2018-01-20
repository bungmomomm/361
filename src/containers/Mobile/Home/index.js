import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import * as data from '@/data/example/Home';

class Home extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<h1>{JSON.stringify(data.Segmen)}</h1>
			</div>);
	}
}

Home.defaultProps = {
	Segmen: data.Segmen,
	Hashtag: data.Hashtag,
	FeaturedBanner: data.FeaturedBanner,
	Middlebanner: data.Middlebanner,
	BottomBanner: data.BottomBanner,
	FeaturedBrand: data.FeaturedBrand,
	Mozaic: data.Mozaic,
	TotalLovelist: data.TotalLovelist,
	TotalCart: data.TotalCart
};


export default withCookies(Home);
