import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Grid, Spinner, Image } from '@/components/mobile';
import { Link } from 'react-router-dom';
import styles from '../products.scss';

class ProductStore extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.store.products !== nextProps.store.products);
	}

	render() {
		try {
			const { store, linkToStore } = this.props;

			console.log('store: ', store);
			return (
				<div className='margin--medium-v margin--none-t'>
					<Link to={linkToStore} >
						<Grid split={4} className={`${styles.gridList} padding--small-h`}>{(
							store.products.map((storeItem, idx) => {
								console.log('rendering store storeItem item: ', storeItem);
								if (idx === (length - 1)) {
									return (
										<div key={`storePNH-${idx}`} className='padding--small-h'>
											<Image src={storeItem.images[0].thumbnail} key={idx} />
											<div className={styles.seeAll}>SEE ALL</div>
										</div>
									);
								}
								return <div key={`storePNH-${idx}`} className='padding--small-h'><Image key={idx} src={storeItem.images[0].thumbnail} /></div>;
							})
						)}</Grid>
					</Link>
				</div>
			);
		} catch (error) {
			console.log('store error: ', error);
			return 'store error';
		}
	}
}

export default withCookies(connect()(ProductStore));
