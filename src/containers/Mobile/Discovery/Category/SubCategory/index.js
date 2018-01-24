import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header,
	// Tabs,
	Divider,
	Svg,
	Page,
	List,
	Image,
	Navigation
} from '@/components/mobile';
// import * as C from '@/constants';
// import styles from './subCategory.scss';

class SubCategory extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const HeaderPage = {
			left: (
				<Link to='/category'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			), 
			center: 'Clothing',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					<Divider>Shop by Products</Divider>
					<List>
						<Link to='/brandcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/brandcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/brandcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/brandcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<Divider>Shop by Products</Divider>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
					<List>
						<Link to='/catalogcategory'>
							<List.Image><Image width={40} height={40} avatar local src='temp/pp.jpg' /></List.Image>
							<List.Content>Tank Top</List.Content>
						</Link>
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Categories' />
			</div>
		);
	}
}


export default withCookies(SubCategory);
