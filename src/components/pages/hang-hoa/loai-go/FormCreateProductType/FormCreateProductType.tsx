import React, {useState} from 'react';

import {PropsFormCreateProductType} from './interfaces';
import styles from './FormCreateProductType.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import {QUERY_KEY, TYPE_PRODUCT} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import InputColor from '~/components/common/InputColor';

function FormCreateProductType({onClose}: PropsFormCreateProductType) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{
		name: string;
		productType: TYPE_PRODUCT;
		description: string;
		colorShow: string;
	}>({name: '', description: '', colorShow: '#16DBCC', productType: TYPE_PRODUCT.CONG_TY});

	const funcCreateProductType = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới loại hàng thành công!',
				http: wareServices.upsertProductType({
					uuid: '',
					name: form.name,
					description: form.description,
					type: form.productType,
					colorShow: form.colorShow,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					description: '',
					productType: TYPE_PRODUCT.CONG_TY,
					colorShow: '#16DBCC',
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_loai_go]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = () => {
		return funcCreateProductType.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateProductType.isLoading} />
			<h4>Thêm loại hàng</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={clsx('mb')}>
					<div className={styles.item}>
						<label className={styles.label}>
							Sử dụng <span style={{color: 'red'}}>*</span>
						</label>
						<div className={styles.group_radio}>
							<div className={styles.item_radio}>
								<input
									type='radio'
									id='cong_ty'
									name='productType'
									checked={form.productType == TYPE_PRODUCT.CONG_TY}
									onChange={() =>
										setForm((prev) => ({
											...prev,
											productType: TYPE_PRODUCT.CONG_TY,
										}))
									}
								/>
								<label htmlFor='cong_ty'>Công ty</label>
							</div>
							<div className={styles.item_radio}>
								<input
									type='radio'
									id='dich_vu'
									name='productType'
									checked={form.productType == TYPE_PRODUCT.DICH_VU}
									onChange={() =>
										setForm((prev) => ({
											...prev,
											productType: TYPE_PRODUCT.DICH_VU,
										}))
									}
								/>
								<label htmlFor='dich_vu'>Dịch vụ</label>
							</div>
							<div className={styles.item_radio}>
								<input
									type='radio'
									id='dung_chung'
									name='productType'
									checked={form.productType == TYPE_PRODUCT.DUNG_CHUNG}
									onChange={() =>
										setForm((prev) => ({
											...prev,
											productType: TYPE_PRODUCT.DUNG_CHUNG,
										}))
									}
								/>
								<label htmlFor='dung_chung'>Dùng chung</label>
							</div>
						</div>
					</div>
				</div>
				<Input
					name='name'
					value={form.name || ''}
					isRequired
					max={255}
					type='text'
					blur={true}
					placeholder='Nhập tên loại hàng'
					label={
						<span>
							Tên loại hàng<span style={{color: 'red'}}> *</span>
						</span>
					}
				/>

				<div className='mt'>
					<InputColor
						label={
							<span>
								Màu hiển thị <span style={{color: 'red'}}>*</span>
							</span>
						}
						color={form.colorShow}
						onSetColor={(color) =>
							setForm((prev) => ({
								...prev,
								colorShow: color,
							}))
						}
					/>
				</div>

				<div className={clsx('mt')}>
					<TextArea placeholder='Thêm mô tả' name='description' label={<span>Mô tả</span>} blur max={5000} />
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<div>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Lưu lại
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default FormCreateProductType;
