import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import handler from '@/containers/Mobile/Shared/handler';
import { Modal, Level, Button, Radio } from '@/components/mobile';
@handler
class ProductModal extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.onCloseOverlaySelectSize = this.onCloseOverlaySelectSize.bind(this);
	}

	onCloseOverlaySelectSize(e) {
		return this.props.onBtnCloseModalClick(e, 'select-size');
	}

	render() {
		console.log('render modal');
		const { showConfirmDelete, showModalSelectSize, forceLogin, showOvoInfo, variants, ovoInfo, selectedSize } = this.props;
		return (
			<div>
				<Modal show={showConfirmDelete}>
					<div className='font-medium'>
						<h3 className='text-center'>Hapus Lovelist</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h margin--medium-h'>
								<div className='font-medium'>Kamu yakin mau hapus produk ini dari Lovelist kamu?</div>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button data-modal='lovelist' onClick={this.props.onBtnCloseModalClick} >
								<strong className='font-color--primary-ext-2'>BATALKAN</strong>
							</Button>)}
						confirmButton={(<Button onClick={this.props.onRemoveLovelist}><strong className='font-color--primary'>YA, HAPUS</strong></Button>)}
					/>
				</Modal>

				<Modal position='bottom' show={showModalSelectSize} onCloseOverlay={this.onCloseOverlaySelectSize}>
					<div className='padding--medium-v'>
						<div className='padding--medium-h'><strong>PILIH UKURAN</strong></div>
						<div className='horizontal-scroll padding--medium-h  margin--medium-r'>
							<Radio
								name='size'
								checked={selectedSize}
								variant='rounded'
								className='margin--small-v'
								onChange={this.props.onVariantSizeChange}
								data={variants}
							/>
						</div>
					</div>
				</Modal>

				<Modal show={forceLogin}>
					<div className='font-medium'>
						<h3 className='text-center'>Lovelist</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h margin--medium-h'>
								<center className='font-medium'>Silahkan login/register untuk menambahkan produk ke Lovelist</center>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button data-modal='login-later' onClick={this.props.onBtnCloseModalClick}>
								<strong className='font-color--primary-ext-2'>NANTI</strong>
							</Button>)}
						confirmButton={(<Button onClick={this.props.onLoginNow}><strong className='font-color--primary'>SEKARANG</strong></Button>)}
					/>
				</Modal>

				<Modal show={showOvoInfo}>
					<div className='font-medium padding--medium-h margin--medium-h'>
						<h3 className='text-center'>OVO Points</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h'>
								<center>
									{(/^/.test(ovoInfo)) && <div dangerouslySetInnerHTML={{ __html: ovoInfo }} />}
									{!(/^/.test(ovoInfo)) && <div>{ovoInfo}</div>}
								</center>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button data-modal='ovo-points' onClick={this.props.onBtnCloseModalClick}>
								<strong className='font-color--primary'>TUTUP</strong>
							</Button>)}
					/>
				</Modal>
			</div>	
		);
	}
};

export default withCookies(connect()(ProductModal));