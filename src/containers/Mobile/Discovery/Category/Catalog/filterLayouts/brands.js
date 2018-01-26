import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
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
import styles from './brands.scss';

class Brands extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			filteredKey: C.FILTER_KEY
		};
	}

	filterlist(key) {
		this.setState({ 
			filteredKey: _.filter(C.FILTER_KEY, (o) => {
				return o.trim() === key;
			}) 
		});
	}

	render() {
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
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
						<Input
							autoFocus
							iconLeft={<Svg src='ico_search.svg' />}
							placeholder='cari nama brand'
						/>
						<div className={styles.listFilterKey}>
							{C.FILTER_KEY.map((key, id) => {
								return (
									<Button key={id} onClick={() => this.filterlist(key)}>{key}</Button>
								);
							})}
						</div>
					</div>
					{this.state.filteredKey.map((key, id) => {
						return (
							<div key={id}>
								<Divider className='margin--none' size='small'>
									{key}
								</Divider>
								<List>
									<Link to='/catalogcategory'>
										<List.Content>ARMANDO CARUSO</List.Content>
									</Link>
								</List>
								<List>
									<Link to='/catalogcategory'>
										<List.Content>ARMANDO CARUSO</List.Content>
									</Link>
								</List>
							</div>
						);
					})}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Categories' />
			</div>
		);
	}
}


export default Brands;
