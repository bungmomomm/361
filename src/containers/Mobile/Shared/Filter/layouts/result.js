import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import _ from 'lodash';
import Action from './action';

// DUMMY DATA
// const DUMMY_RESULT_FILTER = {
// 	data: [{
// 		name: 'Kategori',
// 		params: ['Sneakers'],
// 	}, {
// 		name: 'Style',
// 		params: ['Casual'],
// 	}, {
// 		name: 'Brand',
// 		params: ['3second', 'Arez', 'Cole', 'D&G', 'Nike', 'Hush Puppies'],
// 	}, {
// 		name: 'Warna',
// 		params: ['Black', 'Navy', 'Pink'],
// 	}]
// };

// END DUMMY DATA

class Result extends PureComponent {

	render() {
		const { onClose, onApply, onReset, selected, onListClick, filters } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_close.svg' />
				</Button>
			),
			center: 'Filter',
			right: null
		};
		return (
			<div style={this.props.style}>
				<Page>
					{
						filters.facets.map((facet, idx) => {
							return (
								<List key={idx}>
									<Button align='left' onClick={(e) => onListClick(e, facet.id)}>
										<List.Content style={{ minHeight: '50px' }}>
											<div>
												<div>{facet.title}</div>
												<span className='font-color--secondary font-small text-elipsis' style={{ width: '200px' }}>{_.map(selected[facet.id], (s) => s.facetdisplay).join(',')}</span>
											</div>
										</List.Content>
									</Button>
								</List>
							);
						})
					}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply hasReset onReset={onReset} onApply={onApply} />
			</div>
		);
	}
}

export default Result;
