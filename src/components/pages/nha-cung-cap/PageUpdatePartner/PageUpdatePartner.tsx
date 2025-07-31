import React, {useState} from 'react';
import {IFormUpdatePartner, PropsPageUpdatePartner} from './interfaces';
import styles from './PageUpdatePartner.module.scss';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	TYPE_PARTNER,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import partnerServices from '~/services/partnerServices';
import commonServices from '~/services/commonServices';
import regencyServices from '~/services/regencyServices';
import userServices from '~/services/userServices';
import {toastWarn} from '~/common/funcs/toast';
import Loading from '~/components/common/Loading';
import Form, {FormContext, Input} from '~/components/common/Form';
import Button from '~/components/common/Button';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import TextArea from '~/components/common/Form/components/TextArea';
import {IDetailPartner} from '../PageDetailPartner/interfaces';
import companyServices from '~/services/companyServices';

function PageUpdatePartner({}: PropsPageUpdatePartner) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [form, setForm] = useState<IFormUpdatePartner>({
		description: '',
		name: '',
		taxCode: '',
		email: '',
		address: '',
		phoneNumber: '',
		provinceId: '',
		townId: '',
		userOwenerUuid: '',
		director: '',
		bankName: '',
		bankAccount: '',
		companyUuid: '',
	});

	useQuery<IDetailPartner>([QUERY_KEY.chi_tiet_doi_tac, _id], {
		queryFn: () =>
			httpRequest({
				http: partnerServices.detailPartner({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				description: data?.description || '',
				name: data?.name || '',
				taxCode: data?.taxCode || '',
				email: data?.email || '',
				address: data?.address || '',
				phoneNumber: data?.phoneNumber || '',
				provinceId: data?.detailAddress?.province?.uuid || '',
				townId: data?.detailAddress?.town?.uuid || '',
				userOwenerUuid: data?.userOwnerUu?.uuid || '',
				director: data?.director || '',
				bankName: data?.bankName || '',
				bankAccount: data?.bankAccount || '',
				companyUuid: data?.companyUu?.uuid || '',
			});
		},
		enabled: !!_id,
	});

	const listProvince = useQuery([QUERY_KEY.dropdown_tinh_thanh_pho], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listProvince({
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
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

	const listTown = useQuery([QUERY_KEY.dropdown_xa_phuong, form?.provinceId], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listTown({
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					idParent: form.provinceId,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.provinceId,
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
	const listUser = useQuery([QUERY_KEY.dropdown_nguoi_quan_ly_nhap_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser({
					page: 1,
					pageSize: 50,
					keyword: '',
					regencyUuid: listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])
						? listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid
						: null,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuidExclude: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const funcUpdatePartner = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Cập nhật công ty thành công!',
				http: partnerServices.upsertPartner({
					uuid: _id as string,
					name: form?.name,
					taxCode: form?.taxCode,
					phoneNumber: form?.phoneNumber,
					email: form?.email,
					director: form?.director,
					provinceId: form?.provinceId,
					townId: form?.townId,
					address: form?.address,
					description: form?.description,
					userOwenerUuid: form?.userOwenerUuid,
					bankName: form?.bankName,
					bankAccount: form?.bankAccount,
					type: TYPE_PARTNER.NCC,
					companyUuid: form?.companyUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_doi_tac]);
				router.back();
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		// if (!form.provinceId) {
		// 	return toastWarn({msg: 'Vui lòng chọn tỉnh/thành phố!'});
		// }
		// if (!form.districtId) {
		// 	return toastWarn({msg: 'Vui lòng chọn quận/huyện!'});
		// }
		// if (!form.townId) {
		// 	return toastWarn({msg: 'Vui lòng chọn xã/phường!'});
		// }
		return funcUpdatePartner.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdatePartner.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa công ty</h4>
						<p>Điền đầy đủ các thông tin công ty</p>
					</div>
					<div className={styles.right}>
						<Button onClick={() => router.back()} p_10_24 rounded_2 grey_outline>
							Hủy bỏ
						</Button>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Cập nhật
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</div>
				<div className={styles.form}>
					<Input
						name='name'
						value={form.name || ''}
						isRequired
						isUppercase
						max={255}
						blur={true}
						label={
							<span>
								Tên công ty <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập tên công ty'
					/>
					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='companyUuid'
							placeholder='Chọn KV cảng xuất khẩu'
							readOnly={true}
							value={form?.companyUuid}
							onChange={(e: any) =>
								setForm((prev: any) => ({
									...prev,
									companyUuid: e.target.value,
								}))
							}
							label={
								<span>
									KV cảng xuất khẩu <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listCompany?.data?.map((v: any) => (
								<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
							))}
						</Select>

						<Input
							name='taxCode'
							value={form.taxCode || ''}
							max={255}
							label={<span>Mã số thuế</span>}
							placeholder='Nhập mã số thuế'
						/>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<Input
							name='director'
							value={form.director || ''}
							isRequired
							max={255}
							blur={true}
							label={
								<span>
									Người liên hệ <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập tên người liên hệ'
						/>
						<Select
							isSearch
							name='userOwenerUuid'
							placeholder='Quản lý mua hàng'
							value={form?.userOwenerUuid}
							onChange={(e: any) =>
								setForm((prev: any) => ({
									...prev,
									userOwenerUuid: e.target.value,
								}))
							}
							label={
								<span>
									Quản lý mua hàng <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listUser?.data?.map((v: any) => (
								<Option key={v?.uuid} value={v?.uuid} title={v?.fullName} />
							))}
						</Select>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<div>
							<Input name='email' isEmail value={form.email || ''} label={<span>Email</span>} placeholder='Nhập email' />
						</div>
						<Input
							name='phoneNumber'
							value={form.phoneNumber || ''}
							isRequired
							isPhone
							type='number'
							blur={true}
							label={
								<span>
									Số điện thoại<span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập số điện thoại'
						/>
					</div>
					<div className={clsx('mt', 'col_2')}>
						<div>
							<Input
								name='bankName'
								value={form.bankName || ''}
								max={255}
								label={<span>Ngân hàng</span>}
								placeholder='Nhập ngân hàng'
							/>
						</div>
						<Input
							name='bankAccount'
							value={form.bankAccount || ''}
							isNumber
							max={20}
							label={<span>Số tài khoản</span>}
							placeholder='Nhập số tài khoản'
						/>
					</div>
					<div className={clsx('mt', 'col_2')}>
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
							max={255}
							label={<span>Địa chỉ chi tiết</span>}
							placeholder='Nhập địa chỉ chi tiết'
						/>
					</div>
					<div className={clsx('mt')}>
						<TextArea placeholder='Nhập ghi chú' name='description' label={<span>Ghi chú</span>} max={5000} blur />
					</div>
				</div>
			</Form>
		</div>
	);
}

export default PageUpdatePartner;
