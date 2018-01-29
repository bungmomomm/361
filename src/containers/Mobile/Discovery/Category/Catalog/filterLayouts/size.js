import React, { PureComponent } from 'react';
import { Header, Page, Divider, Svg, List } from '@/components/mobile';
import { Link } from 'react-router-dom';
import Action from './action';

class Size extends PureComponent {
	render() {
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Ukuran',
			right: null
		};

		const icon = <Svg src='ico_empty.svg' />;

		return (
			<div style={this.props.style}>
				<Page>
					<Divider className='margin--none'>Pakaian</Divider>
					<List><List.Content>S <Svg src='ico_check.svg' /></List.Content></List>
					<List><List.Content>M {icon}</List.Content></List>
					<List><List.Content>L {icon}</List.Content></List>
					<List><List.Content>XL {icon}</List.Content></List>
					<Divider className='margin--none'>Sepatu</Divider>
					<List><List.Content>S {icon}</List.Content></List>
					<List><List.Content>M {icon}</List.Content></List>
					<List><List.Content>L {icon}</List.Content></List>
					<List><List.Content>XL {icon}</List.Content></List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Size;
