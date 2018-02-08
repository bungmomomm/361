import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Header, Svg, Comment, Input, Button, Level } from '@/components/mobile';
import styles from './comments.scss';

class Comments extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const HeaderOption = {
			left: (
				<Link to='/'>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: 'Comments',
			right: null
		};
		return (
			<div>
				<Page>
					<div className='margin--medium'>
						<p className='margin--small padding--medium'>
							lydoaharyantho and 287 others love this
							DELLOVISIMO Dress, red, premium cotton, bust 88 and length 94, ready to ship 3 Jan 2018.
						</p>
						<span className='margin--small padding--medium'>
							<a>#jualbajubangkok</a> <a>#supplierbangkok</a> <a>#pobkkfirsthand</a> <a>#pobkk</a> <a>#pohk</a> <a>#grosirbaju</a> <a>#premiumquaity</a> <a>#readytowear</a> <a>#ootdindo</a> <a>#olshop</a> <a>#trustedseller</a> <a>#supplierbaju</a> <a>#pochina</a>
						</span>
					</div>
					<div style={{ marginBottom: '100px' }}>
						<Comment />
						<Comment />
						<Comment />
						<Comment />
						<Comment />
						<Comment />
					</div>
				</Page>
				<Header.Modal {...HeaderOption} />
				<Level className={styles.commentbox}>
					<Level.Item><Input color='white' placeholder='Type a message ...' /></Level.Item>
					<Level.Right><Button className='padding--small font--lato-normal' style={{ marginLeft: '15px' }}>KIRIM</Button></Level.Right>
				</Level>
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Comments));
