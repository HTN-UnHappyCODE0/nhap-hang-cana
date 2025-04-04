import {useMutation, useQueryClient} from '@tanstack/react-query';
import {PropsPopupConfirmDryness} from './interfaces';
import {useState} from 'react';
import Form, {FormContext} from '~/components/common/Form';

import styles from './PopupConfirmDryness.module.scss';
import Button from '~/components/common/Button';
import {IoClose, IoHelpCircleOutline} from 'react-icons/io5';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import TextArea from '~/components/common/Form/components/TextArea';
import fixDrynessServices from '~/services/fixDrynessServices';
import clsx from 'clsx';

function PopupConfirmDryness({dataBillChangeDryness, onClose}: PropsPopupConfirmDryness) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{description: string}>({
		description: '',
	});

	const funcRemoveFixDryness = useMutation({
		mutationFn: (body: {uuids: string[]; description: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận duyệt thay đổi độ khô thành công!',
				http: fixDrynessServices.acceptFixDryness({
					uuid: body.uuids,
					description: body.description,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_do_kho_doi_duyet]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		return funcRemoveFixDryness.mutate({
			uuids: dataBillChangeDryness,
			description: form.description,
		});
	};

	return (
		<div className={clsx('effectZoom', styles.popup)}>
			<Loading loading={funcRemoveFixDryness.isLoading} />
			<div className={styles.iconWarn}>
				<IoHelpCircleOutline />
			</div>

			<p className={styles.note}>Bạn chắc chắn muốn xác nhận duyệt cho phiếu này?</p>
			<div className={clsx('mt')}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<div className='mt'>
						<TextArea
							label={
								<span>
									Lý do thay đổi <span style={{color: 'red'}}>*</span>
								</span>
							}
							isRequired
							name='description'
							max={5000}
							blur
							placeholder='Nhập lý do hủy'
						/>
					</div>
					<div className={styles.groupBtnPopup}>
						<Button p_10_24 grey_2 rounded_8 bold onClick={onClose} maxContent>
							Đóng
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 primary bold rounded_8 onClick={handleSubmit} maxContent>
									Xác nhận
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default PopupConfirmDryness;
