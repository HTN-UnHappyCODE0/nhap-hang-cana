import React, {useEffect, useState} from 'react';

import {PropsFormUpdatePriceTag} from './interfaces';
import styles from './FormUpdatePriceTag.module.scss';
import {IoClose} from 'react-icons/io5';
import Form, {FormContext, Input} from '~/components/common/Form';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATE_SPEC_CUSTOMER,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import priceTagServices from '~/services/priceTagServices';
import SelectSearch from '~/components/common/SelectSearch';
import Button from '~/components/common/Button';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import clsx from 'clsx';
import DatePicker from '~/components/common/DatePicker';
import {PiSealWarningFill} from 'react-icons/pi';
import Moment from 'react-moment';
import moment from 'moment';
import {timeSubmit} from '~/common/funcs/optionConvert';
import wareServices from '~/services/wareServices';

function FormUpdatePriceTag({dataUpdate, onClose}: PropsFormUpdatePriceTag) {
	const queryClient = useQueryClient();

	const [priceTag, setPriceTag] = useState<any>({});
	const [priceTagFuture, setPriceTagFuture] = useState<any>({});
	const [form, setForm] = useState<any>({
		customer: '',
		productType: '',
		spec: '',
		quality: '',
		transport: '',
		state: CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP,
		timeStart: null,
		timeEnd: null,
	});

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach, form.productTypeUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: '',
					productTypeUuid: form.productTypeUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.productTypeUuid,
	});

	const listQuality = useQuery([QUERY_KEY.dropdown_quoc_gia], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listQuality({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listPriceTag = useQuery([QUERY_KEY.dropdown_gia_tien_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: priceTagServices.listPriceTagDropDown({
					page: 1,
					pageSize: 10,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listPriceTagFuture = useQuery([QUERY_KEY.dropdown_gia_tien_hang_tuong_lai], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: priceTagServices.listPriceTagDropDown({
					page: 1,
					pageSize: 10,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		if (dataUpdate) {
			setForm({
				customer: dataUpdate?.customerUu?.name,
				productType: dataUpdate?.productTypeUu?.name,
				spec: dataUpdate?.specUu?.name || '',
				quality: dataUpdate?.qualityUu?.name || '',
				transport:
					dataUpdate?.transportType == TYPE_TRANSPORT.DUONG_BO
						? 'Đường bộ'
						: dataUpdate?.transportType == TYPE_TRANSPORT.DUONG_THUY
						? 'Đường thủy'
						: '---',
				state: dataUpdate?.state,
			});
			setPriceTag({
				id: dataUpdate?.pricetagUu?.uuid || '',
				name: dataUpdate?.pricetagUu?.amount || 0,
			});
		}
	}, [dataUpdate]);

	const funcUpdateSpecification = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa giá tiền hàng thành công!',
				http: priceTagServices.updatePricetagToCustomer({
					uuid: dataUpdate?.uuid!,
					priceTagUuid: priceTag.id === '' ? String(priceTag.name) : priceTag.id,
					state: form.state,
					status: CONFIG_STATUS.HOAT_DONG,
					pricetagAfterUuid: priceTagFuture.id === '' ? String(priceTagFuture.name) : priceTagFuture.id,
					timeStart: form.timeStart ? timeSubmit(form.timeStart) : null,
					timeEnd: form.timeEnd ? timeSubmit(form.timeEnd, true) : null,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_gia_tien_hang]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (!dataUpdate?.uuid) {
			return toastWarn({msg: 'Không tìm thấy giá thay đổi!'});
		}

		// if (!!form.timeStart) {
		// 	const timeStart = new Date(form.timeStart);
		// 	if (timeStart < new Date()) {
		// 		return toastWarn({msg: 'Ngày bắt đầu phải lớn hơn ngày hiện tại!'});
		// 	}
		// }

		if (!form.timeStart) {
			return toastWarn({msg: 'Vui lòng chọn ngày bắt đầu!'});
		}
		// if (!form.timeEnd) {
		// 	return toastWarn({msg: 'Vui lòng chọn ngày kết thúc!'});
		// }

		if (!!form.timeEnd) {
			const timeStart = new Date(form.timeStart);
			const timeEnd = new Date(form.timeEnd);

			// if (timeEnd < new Date()) {
			// 	return toastWarn({msg: 'Ngày kết thúc phải lớn hơn ngày hiện tại!'});
			// }

			if (timeStart > timeEnd) {
				return toastWarn({msg: 'Ngày kết thúc không nhỏ hơn ngày bắt đầu!'});
			}
		}

		return funcUpdateSpecification.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateSpecification.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.main_form}>
					<h4 className={styles.title}>Chỉnh sửa giá tiền hàng</h4>
					<div className={styles.main}>
						<div className={clsx('mt')}>
							<Input
								placeholder='Nhập nhà cung cấp'
								name='customer'
								readOnly={true}
								label={
									<span>
										Nhà cung cấp <span style={{color: 'red'}}>*</span>
									</span>
								}
							/>
						</div>
						<div className={clsx('mt', 'col_2')}>
							<div>
								<Input
									placeholder='Loại hàng'
									name='productType'
									readOnly={true}
									label={
										<span>
											Loại hàng <span style={{color: 'red'}}>*</span>
										</span>
									}
								/>
							</div>
							<div>
								<Input
									placeholder='Phương thức vận chuyển'
									name='transport'
									readOnly={true}
									label={
										<span>
											Phương thức vận chuyển <span style={{color: 'red'}}>*</span>
										</span>
									}
								/>
							</div>
						</div>
						<div className={clsx('mt', 'col_2')}>
							<Input
								placeholder='Chưa có quy cách'
								name='spec'
								readOnly={true}
								label={
									<span>
										Quy cách <span style={{color: 'red'}}>*</span>
									</span>
								}
							/>
							<div>
								<Input
									placeholder='Chưa có quốc gia'
									name='quality'
									readOnly={true}
									label={
										<span>
											Quốc gia <span style={{color: 'red'}}>*</span>
										</span>
									}
								/>
							</div>
						</div>

						<div className={clsx('mt', 'col_2')}>
							<DatePicker
								icon={true}
								label={
									<span>
										Từ ngày<span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Chọn ngày'
								value={form?.timeStart}
								onSetValue={(date) =>
									setForm((prev: any) => ({
										...prev,
										timeStart: date,
									}))
								}
								name='timeStart'
								onClean={true}
							/>
							<div>
								<DatePicker
									icon={true}
									label={<span>Đến ngày</span>}
									placeholder='Chọn ngày'
									value={form?.timeEnd}
									onSetValue={(date) => {
										setForm((prev: any) => ({
											...prev,
											timeEnd: date,
										}));

										if (!date) {
											setPriceTagFuture(0);
										}
									}}
									name='timeEnd'
									onClean={true}
								/>
							</div>
						</div>

						<div className={clsx('mt', 'col_2')}>
							<SelectSearch
								isConvertNumber={true}
								options={listPriceTag?.data?.map((v: any) => ({
									id: v?.uuid,
									name: String(v?.amount),
								}))}
								data={priceTag}
								setData={setPriceTag}
								label={
									<div className={styles.detail}>
										<span>Giá tiền áp dụng</span>
										<div className={styles.action}>
											<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
											<div className={styles.note}>
												<p>
													Giá tiền áp dụng từ ngày{' '}
													<>
														{form?.timeStart ? (
															<Moment date={form?.timeStart} format='DD/MM/YYYY' />
														) : (
															'--/--/----'
														)}
													</>{' '}
													đến ngày{' '}
													<>
														{form?.timeEnd ? <Moment date={form?.timeEnd} format='DD/MM/YYYY' /> : '--/--/----'}
													</>
												</p>
											</div>
										</div>
									</div>
								}
								placeholder='Nhập giá tiền'
							/>
							<div>
								<SelectSearch
									isConvertNumber={true}
									options={listPriceTagFuture?.data?.map((v: any) => ({
										id: v?.uuid,
										name: String(v?.amount),
									}))}
									readonly={form?.timeEnd == null}
									data={priceTagFuture}
									setData={setPriceTagFuture}
									label={
										<div className={styles.detail}>
											<span>Giá tiền sau khi kết thúc</span>
											<div className={styles.action}>
												<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
												<div className={styles.note}>
													<p>
														giá tiền pháp dụng sau ngày
														<>
															{form?.timeEnd ? (
																<Moment date={form?.timeEnd} format='DD/MM/YYYY' />
															) : (
																'--/--/----'
															)}
														</>
													</p>
												</div>
											</div>
										</div>
									}
									placeholder='Nhập giá tiền'
								/>
							</div>
						</div>

						<div className='mt'>
							<div className={styles.input_price}>
								<input
									id={`state_spec_customer`}
									name='state'
									value={form.state}
									type='checkbox'
									className={styles.input}
									checked={form?.state == CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP}
									onChange={() =>
										setForm((prev: any) => ({
											...prev,
											state:
												prev.state == CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP
													? CONFIG_STATE_SPEC_CUSTOMER.CHUA_CUNG_CAP
													: CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP,
										}))
									}
								/>
								<label className={styles.label_check_box} htmlFor={`state_spec_customer`}>
									Đang cung cấp
								</label>
							</div>
						</div>
					</div>

					<div className={styles.control}>
						<div>
							<Button p_8_24 rounded_2 grey_outline onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button disable={!isDone} p_10_24 rounded_2 primary>
										Xác nhận
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
				</div>
			</Form>
			<div className={styles.icon_close} onClick={onClose}>
				<IoClose size={24} color='#23262F' />
			</div>
		</div>
	);
}

export default FormUpdatePriceTag;
