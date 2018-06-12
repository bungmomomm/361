import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styles from './suggestion.scss';

class Suggestion extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		
		const { show } = this.props;
		const inlineStyle = {
			display: (show === false) ? 'none' : 'block'
		};
		
		return (
			<div className={styles.suggestionWrapper} style={inlineStyle}>
				<div className={styles.sectionWrapper}>
					{ /* Category */ }
					<section className={styles.section}>
						<div className={styles.heading}>Kategori</div>
						<ul className={styles.list}>
							<li key={1} >
								<Link to={''} onClick={() => { }}>
									sepatu di <span>Semua Kategori</span>
								</Link>
							</li>
							<li key={2} >
								<Link to={''} onClick={() => { }}>
									sepatu di <span>Semua Pria</span>
								</Link>
							</li>
							<li key={3} >
								<Link to={''} onClick={() => { }}>
									sepatu di <span>Semua Wanita</span>
								</Link>
							</li>
						</ul>
					</section>
					
					{ /* Saran Pencarian */ }
					<section className={styles.section}>
						<div className={styles.heading}>Saran Pencarian</div>
						<ul className={styles.list}>
							<li key={1} >
								<Link to={''} onClick={() => { }}>
									sepatu <span>pria</span>
								</Link>
							</li>
							<li key={2} >
								<Link to={''} onClick={() => { }}>
									sepatu <span>merah</span>
								</Link>
							</li>
							<li key={3} >
								<Link to={''} onClick={() => { }}>
									sepatu <span>lari</span>
								</Link>
							</li>
						</ul>
					</section>
				</div>
			</div>
		);
		
	}
	
}

export default withRouter(Suggestion);