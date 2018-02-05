import React, { PureComponent } from 'react';
import { Header, Page, Divider, Svg, List, Button } from '@/components/mobile';
import Action from './action';

class Size extends PureComponent {
	render() {
		const { onClose } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Ukuran',
			right: null
		};

		// to do: use below logic when implement
		// const icon = false ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
		const icon = <Svg src='ico_check.svg' />;

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
