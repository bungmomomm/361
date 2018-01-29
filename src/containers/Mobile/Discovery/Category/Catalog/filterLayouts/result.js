import React, { PureComponent } from 'react';
import { Header, Page, Svg, List } from '@/components/mobile';
import Action from './action';
import { Link } from 'react-router-dom';

// DUMMY DATA
const DUMMY_RESULT_FILTER = {
	data: [{
		name: 'Kategori',
		params: ['Sneakers'],
	}, {
		name: 'Style',
		params: ['Casual'],
	}, {
		name: 'Brand',
		params: ['3second', 'Arez', 'Cole', 'D&G', 'Nike', 'Hush Puppies'],
	}, {
		name: 'Warna',
		params: ['Black', 'Navy', 'Pink'],
	}]
};

// END DUMMY DATA

class Result extends PureComponent {
	render() {
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src='ico_close.svg' />
				</Link>
			),
			center: 'Filter',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					{
						DUMMY_RESULT_FILTER.data.map((category, idx) => (
							<List key={idx}>
								<Link to='/'>
									<List.Content style={{ minHeight: '50px' }}>
										<div>
											<div>{category.name}</div>
											<span className='font-color--secondary font-small text-elipsis' style={{ width: '200px' }}>{category.params.join(', ')}</span>
										</div>
									</List.Content>
								</Link>
							</List>
						))
					}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply />
			</div>
		);
	}
}

export default Result;
