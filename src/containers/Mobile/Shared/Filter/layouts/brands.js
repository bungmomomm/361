import React, { Component } from 'react';
import _ from 'lodash';
import {
	Header,
	Button,
	Input,
	// Divider,
	Svg,
	Page,
	List,
	// Navigation
} from '@/components/mobile';
import Action from './action';
import C from '@/constants';
import styles from './brands.scss';

const brandWalker = (brands, m) => {
	if (typeof m === 'undefined') {
		m = [];
	}
	_.forEach(brands, (brand) => {
		if (typeof (brand.brands) !== 'undefined' && brand.brands.length > 0) {
			brandWalker(brand.brands, m);
		} else {
			m.push(brand.id);
		}
	});
	return m;
};

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
		this.setState({
			keyword: e.target.value
		});
	} 

	render() {
		const { onClose, onClick, filters } = this.props;
		const { keyword } = this.state;
		const brandFacet = _.filter(filters.facets, (facet) => facet.id === 'brand');
		let brandLists = [];
		if (typeof brandFacet[0] !== 'undefined') {
			brandLists = brandFacet[0].data;
		}

		if (brandLists.length > 0) {
			if (!_.isEmpty(keyword)) {
				brandLists = _.filter(brandLists, (brand) => {
					const rgx = new RegExp(keyword, 'gi');
					return (brand.facetdisplay.search(rgx)) > -1;
				});
			}
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
					</div>
					<List>
						{brandLists.map((brand, id) => {
							const icon = brand.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
							return (
								<Button key={id} align='left' wide onClick={(e) => onClick(e, brand)}><List.Content>{brand.facetdisplay} ({brand.count}) {icon}</List.Content></Button>
							);
						})}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}


export default Brands;
