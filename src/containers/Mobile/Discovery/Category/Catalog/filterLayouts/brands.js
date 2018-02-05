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
import Action from './action';
import C from '@/constants';
import styles from './brands.scss';

class Brands extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			keyword: '',
			filteredKey: C.FILTER_KEY
		};
	}

	filterlist(key) {
		this.setState({ 
			filteredKey: key
		});
	}

	searchBrand(e) {
		console.log(this.state);
		this.setState({
			keyword: e.target.value
		});
	} 

	render() {
		const { onClose, filters } = this.props;
		const { keyword } = this.state;
		const brandFacet = _.filter(filters.facets, (facet) => facet.id === 'brand');
		let brands = [];
		if (typeof brandFacet[0] !== 'undefined') {
			brands = brandFacet[0].data;
		}

		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
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
							value={keyword}
							onChange={(e) => this.searchBrand(e)}
						/>
						<div className={styles.listFilterKey}>
							<Button onClick={() => this.filterlist('')}>ALL</Button>
							{brands.map((brandGroup, id) => {
								return (
									<Button key={id} onClick={() => this.filterlist(brandGroup.group)}>{brandGroup.group}</Button>
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
				<Action />
			</div>
		);
	}
}


export default Brands;
