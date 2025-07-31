import React, {useState} from 'react';

import {IFormCreateWorkshop, PropsPageCreateWorkshop} from './interfaces';
import styles from './PageCreateWorkshop.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	TYPE_CUSTOMER,
	TYPE_PARTNER,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import commonServices from '~/services/commonServices';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import TextArea from '~/components/common/Form/components/TextArea';
import {useRouter} from 'next/router';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import customerServices from '~/services/customerServices';
import regencyServices from '~/services/regencyServices';
import userServices from '~/services/userServices';
import warehouseServices from '~/services/warehouseServices';
import partnerServices from '~/services/partnerServices';

function PageCreateWorkshop({}: PropsPageCreateWorkshop) {
	const router = useRouter();

	const {_partnerUuid, _typeCus} = router.query;

	const [form, setForm] = useState<IFormCreateWorkshop>({
		name: '',
		userUuid: '',
		director: '',
		email: '',
		phoneNumber: '',
		provinceId: '',
		townId: '',
		address: '',
		description: '',
		transportType: TYPE_TRANSPORT.DUONG_THUY,
		partnerUuid: '',
		isSift: TYPE_SIFT.KHONG_CAN_SANG,
		warehouseUuid: '',
	});

	const listRegency = useQuery([QUERY_KEY.dropdown_chuc_vu], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: regencyServices.listRegency({
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

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap, _typeCus], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: partnerServices.listPartner({
					pageSize: 50,
					page: 1,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					isPaging: CONFIG_PAGING.NO_PAGING,
					userUuid: '',
					provinceId: '',
					type: !!_typeCus ? null : TYPE_PARTNER.NCC,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listUser = useQuery([QUERY_KEY.dropdown_nhan_vien_thi_truong], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser2({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuid: [
						listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid,
						listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Nhân viên thị trường'])?.uuid,
					],
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const listProvince = useQuery([QUERY_KEY.dropdown_tinh_thanh_pho], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listProvince({
					keyword: '',
					status: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listTown = useQuery([QUERY_KEY.dropdown_xa_phuong, form.provinceId], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listTown({
					keyword: '',
					status: null,
					idParent: form.provinceId,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.provinceId,
	});

	const listWarehouse = useQuery([QUERY_KEY.dropdown_kho_hang_chinh], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: warehouseServices.listWarehouse({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					customerUuid: '',
					timeEnd: null,
					timeStart: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcCreateCustomer = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: `Thêm ${!!_typeCus ? 'khách hàng' : 'nhà cung cấp'} thành công!`,
				http: customerServices.upsertCustomer({
					uuid: '',
					transportType: form.transportType!,
					isSift: form?.isSift!,
					name: form.name,
					phoneNumber: form?.phoneNumber,
					provinceId: form?.provinceId,
					townId: form?.townId,
					address: form?.address,
					userUuid: form?.userUuid,
					warehouseUuid: form?.warehouseUuid,
					description: form?.description,
					director: form?.director,
					email: form?.email,
					partnerUuid: _partnerUuid ? String(_partnerUuid) : form?.partnerUuid,
					typeCus: Number(_typeCus) || TYPE_CUSTOMER.NHA_CUNG_CAP,
				}),
			}),
		onSuccess(data) {
			if (data) {
				router.back();
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (form.transportType == null) {
			return toastWarn({msg: 'Vui lòng chọn phương thức vận chuyển!'});
		}
		if (!form.userUuid) {
			return toastWarn({msg: 'Vui lòng chọn nhân viên quản lý!'});
		}
		// if (!form.provinceId) {
		// 	return toastWarn({msg: 'Vui lòng chọn tỉnh/thành phố!'});
		// }
		// if (!form.districtId) {
		// 	return toastWarn({msg: 'Vui lòng chọn quận/huyện!'});
		// }
		// if (!form.townId) {
		// 	return toastWarn({msg: 'Vui lòng chọn xã/phường!'});
		// }
		if (!form.partnerUuid) {
			return toastWarn({msg: `Vui lòng nhập tên ${!!_typeCus ? 'khách hàng' : 'nhà cung cấp'}!`});
		}
		if (!form.director) {
			return toastWarn({msg: 'Vui lòng nhập tên người đại diện!'});
		}

		return funcCreateCustomer.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateCustomer.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>
							Thêm mới{' '}
							{TYPE_PARTNER.KH_XUAT === Number(_typeCus)
								? 'khách hàng'
								: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
								? 'khách hàng'
								: TYPE_PARTNER.NCC === Number(_typeCus)
								? 'nhà cung cấp'
								: 'nhà cung cấp'}
						</h4>
						<p>
							Điền đầy đủ các thông tin{' '}
							{TYPE_PARTNER.KH_XUAT === Number(_typeCus)
								? 'khách hàng'
								: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
								? 'khách hàng'
								: TYPE_PARTNER.NCC === Number(_typeCus)
								? 'nhà cung cấp'
								: 'nhà cung cấp'}
						</p>
					</div>
					<div className={styles.right}>
						<Button onClick={() => router.back()} p_10_24 rounded_2 grey_outline>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Lưu lại
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.form}>
					<div className={clsx('mb', 'col_4')}>
						<div className={styles.item}>
							<label className={styles.label}>
								Vận chuyển <span style={{color: 'red'}}>*</span>
							</label>
							<div className={styles.group_radio}>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='van_chuyen_bo'
										name='transportType'
										checked={form.transportType == TYPE_TRANSPORT.DUONG_BO}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												transportType: TYPE_TRANSPORT.DUONG_BO,
											}))
										}
									/>
									<label htmlFor='van_chuyen_bo'>Đường bộ</label>
								</div>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='van_chuyen_thủy'
										name='transportType'
										checked={form.transportType == TYPE_TRANSPORT.DUONG_THUY}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												transportType: TYPE_TRANSPORT.DUONG_THUY,
											}))
										}
									/>
									<label htmlFor='van_chuyen_thủy'>Đường thủy</label>
								</div>
							</div>
						</div>
						<div className={styles.item}>
							<label className={styles.label}>
								Phân loại <span style={{color: 'red'}}>*</span>
							</label>
							<div className={styles.group_radio}>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='phan_loai_da_sang'
										name='isSift'
										checked={form.isSift == TYPE_SIFT.CAN_SANG}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												isSift: TYPE_SIFT.CAN_SANG,
											}))
										}
									/>
									<label htmlFor='phan_loai_da_sang'>Cần sàng</label>
								</div>
								<div className={styles.item_radio}>
									<input
										type='radio'
										id='phan_loai_chua_sang'
										name='isSift'
										checked={form.isSift == TYPE_SIFT.KHONG_CAN_SANG}
										onChange={() =>
											setForm((prev) => ({
												...prev,
												isSift: TYPE_SIFT.KHONG_CAN_SANG,
											}))
										}
									/>
									<label htmlFor='phan_loai_chua_sang'>Không cần sàng</label>
								</div>
							</div>
						</div>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<Input
							name='name'
							value={form.name || ''}
							isRequired
							max={255}
							type='text'
							blur={true}
							label={
								<span>
									Tên{' '}
									{TYPE_PARTNER.NCC === Number(_typeCus)
										? 'nhà cung cấp'
										: TYPE_PARTNER.KH_XUAT === Number(_typeCus)
										? 'khách hàng'
										: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
										? 'khách hàng'
										: 'nhà cung cấp'}{' '}
									<span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder={`Nhập tên ${
								TYPE_PARTNER.NCC === Number(_typeCus)
									? 'nhà cung cấp'
									: TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'khách hàng'
									: 'nhà cung cấp'
							}`}
						/>
						<div>
							<Input
								name='director'
								value={form.director || ''}
								isRequired
								type='text'
								max={255}
								label={
									<span>
										Người liên hệ <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập tên người liên hệ'
							/>
						</div>
					</div>

					<div className={clsx('mt', 'col_3')}>
						<Select
							isSearch
							readOnly={!!_partnerUuid}
							name='partnerUuid'
							placeholder={
								TYPE_PARTNER.NCC === Number(_typeCus)
									? 'Chọn công ty'
									: TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'Chọn khách hàng xuất'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'Chọn khách hàng dịch vụ'
									: 'Chọn công ty'
							}
							value={_partnerUuid || form?.partnerUuid}
							onChange={(e: any) =>
								setForm((prev: any) => ({
									...prev,
									partnerUuid: e.target.value,
								}))
							}
							label={
								<span>
									{TYPE_PARTNER.NCC === Number(_typeCus)
										? 'Thuộc công ty'
										: TYPE_PARTNER.KH_XUAT === Number(_typeCus)
										? 'Thuộc khách hàng xuất'
										: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
										? 'Thuộc khách hàng dịch vụ'
										: 'Thuộc công ty'}
									<span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listPartner?.data?.map((v: any) => (
								<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
							))}
						</Select>
						<Input
							name='email'
							value={form.email || ''}
							isEmail
							max={255}
							type='text'
							blur={true}
							label={<span>Email</span>}
							placeholder='Nhập email'
						/>

						<div>
							<Input
								name='phoneNumber'
								value={form.phoneNumber || ''}
								isRequired
								isPhone
								type='number'
								blur={true}
								label={
									<span>
										Số điện thoại <span style={{color: 'red'}}>*</span>
									</span>
								}
								placeholder='Nhập số điện thoại'
							/>
						</div>
					</div>

					<div className={clsx('mt', 'col_2')}>
						<div>
							<Select
								isSearch
								name='userUuid'
								placeholder='Chọn nhân viên'
								value={form?.userUuid}
								onChange={(e: any) =>
									setForm((prev: any) => ({
										...prev,
										userUuid: e.target.value,
									}))
								}
								label={
									<span>
										Thuộc nhân viên quản lý <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listUser?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.fullName} />
								))}
							</Select>
						</div>
						<Select
							isSearch
							name='warehouseUuid'
							placeholder='Chọn kho hàng chính'
							value={form?.warehouseUuid}
							label={<span>Kho hàng chính</span>}
						>
							{listWarehouse?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											warehouseUuid: v?.uuid,
										}))
									}
								/>
							))}
						</Select>
					</div>

					<div className={clsx('mt', 'col_3')}>
						<Select
							isSearch
							name='provinceId'
							value={form.provinceId}
							placeholder='Chọn tỉnh/thành phố'
							label={<span>Tỉnh/Thành phố</span>}
						>
							{listProvince?.data?.map((v: any) => (
								<Option
									key={v?.matp}
									value={v?.matp}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											provinceId: v?.matp,
											townId: '',
											userUuid: '',
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select isSearch name='townId' value={form.townId} placeholder='Chọn xã/phường' label={<span>Xã/phường</span>}>
								{listTown?.data?.map((v: any) => (
									<Option
										key={v?.xaid}
										value={v?.xaid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												townId: v?.xaid,
											}))
										}
									/>
								))}
							</Select>
						</div>
					</div>
					<div className={clsx('mt')}>
						<Input
							name='address'
							value={form.address || ''}
							type='text'
							max={255}
							label={<span>Địa chỉ chi tiết</span>}
							placeholder='Nhập địa chỉ chi tiết'
						/>
					</div>

					<div className={clsx('mt')}>
						<TextArea max={5000} blur name='description' placeholder='Nhập ghi chú' label={<span>Ghi chú</span>} />
					</div>
				</div>
			</Form>
		</div>
	);
}

export default PageCreateWorkshop;
