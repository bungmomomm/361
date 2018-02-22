import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import { Link } from 'react-router-dom';
import Action from './action';
import styles from './tree.scss';

class Tree extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: null,
			selected: null,
			data: props.data || []
		};
		this.props = props;
	}
	handleTree(value, isParent) {
		if (isParent) {
			this.setState({ 
				activeTree: value !== this.state.activeTree ? value : null
			});
		} else {
			this.setState({ selected: value });
		}
	}
	render() {
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Lokasi',
			right: null
		};
		
		const { activeTree, selected } = this.state;

		const treeIcon = (active, HasTree) => {
			if (HasTree) {
				return active ? <Svg src='ico_chevron-up.svg' /> : <Svg src='ico_chevron-down.svg' />;
			}
			if (active) {
				return <Svg src='ico_check.svg' />;
			}
			return <Svg src='ico_empty.svg' />;
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div>
						<List><Button onClick={() => this.handleTree('mancanegara')}><List.Content>Mancanegara {treeIcon()}</List.Content></Button></List>
						<List><Button onClick={() => this.handleTree('bali', true)}><List.Content>bali {treeIcon(activeTree === 'bali', true)}</List.Content></Button></List>
						{
							activeTree === 'bali' && (
								<div className={styles.child}>
									<List><Button onClick={() => this.handleTree('seluruhbali')}><List.Content>SELURUH BALI {treeIcon(selected === 'seluruhbali')}</List.Content></Button></List>
									<List><Button onClick={() => this.handleTree('kabbadung')}><List.Content>Kab. Badung {treeIcon(selected === 'kabbadung')}</List.Content></Button></List>
									<List><Button onClick={() => this.handleTree('kabbangli')}><List.Content>Kab. Bangli {treeIcon(selected === 'kabbangli')}</List.Content></Button></List>
									<List><Button onClick={() => this.handleTree('kabbuleleng')}><List.Content>Kab. Buleleng {treeIcon(selected === 'kabbuleleng')}</List.Content></Button></List>
								</div>
							)
						}
						<List><Button onClick={() => this.handleTree('medan', true)}><List.Content>medan {treeIcon(activeTree === 'medan', true)}</List.Content></Button></List>
						{
							activeTree === 'medan' && (
								<div className={styles.child}>
									<List><Button onClick={() => this.handleTree('seluruhbali')}><List.Content>SELURUH BALI {treeIcon(selected === 'seluruhbali')}</List.Content></Button></List>
									<List><Button onClick={() => this.handleTree('kabbadung')}><List.Content>Kab. Badung {treeIcon(selected === 'kabbadung')}</List.Content></Button></List>
									<List><Button onClick={() => this.handleTree('kabbangli')}><List.Content>Kab. Bangli {treeIcon(selected === 'kabbangli')}</List.Content></Button></List>
									<List><Button onClick={() => this.handleTree('kabbuleleng')}><List.Content>Kab. Buleleng {treeIcon(selected === 'kabbuleleng')}</List.Content></Button></List>
								</div>
							)
						}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Tree;
