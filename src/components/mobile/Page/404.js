import React from 'react';
import styles from './page.scss';

const Page404 = props => {
	const inlineStyle = {
		textAlign: 'center',
		margin: '10px auto 10px auto'
	};
	
	return (
		<div className={styles.container} >
			<div style={inlineStyle}>[image 404]</div>
			<div style={inlineStyle}>
				OOPS!
			</div>
			<div style={inlineStyle}>
				Maaf, halaman yang kamu tuju tidak ditemukan.
			</div>
			<div style={inlineStyle}>
				Periksa kembali link yang kamu tuju.
			</div>
			<div style={inlineStyle}>[Rich Relevant Recommendation section]</div>
			<div style={inlineStyle}>[Footer]</div>
		</div>
	);
};

export default Page404;
