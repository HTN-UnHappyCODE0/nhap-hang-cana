import {useMutation, useQuery} from '@tanstack/react-query';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {toastWarn} from '~/common/funcs/toast';
import Button from '~/components/common/Button';
import Form, {FormContext, Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import Loading from '~/components/common/Loading';
import Select, {Option} from '~/components/common/Select';
import {PATH} from '~/constants/config';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import commonServices from '~/services/commonServices';
import scalesStationServices from '~/services/scalesStationServices';
import warehouseServices from '~/services/warehouseServices';
import styles from './MainUpdateWarehouse.module.scss';
import {IFormUpdateWarehouse, PropsMainUpdateWarehouse} from './interfaces';
import companyServices from '~/services/companyServices';

function MainUpdateWarehouse({}: PropsMainUpdateWarehouse) {
	const router = useRouter();

	const {_id} = router.query;

	const [form, setForm] = useState<IFormUpdateWarehouse>({
		uuid: '',
		name: '',
		address: '',
		scaleStationUuid: '',
		provinceId: '',
		townId: '',
		description: '',
		companyUuid: '',
	});

	useQuery([QUERY_KEY.chi_tiet_kho_hang, _id], {
		queryFn: () =>
			httpRequest({
				http: warehouseServices.detailWarehouse({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					...data,
					scaleStationUuid: data?.scaleStationUu?.uuid || null,
					provinceId: data?.detailAddress?.province?.uuid,
					dictrictId: data?.detailAddress?.district?.uuid,
					townId: data?.detailAddress?.town?.uuid,
					companyUuid: data?.companyUu?.uuid || '',
				});
			}
		},
		enabled: !!_id,
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

	const listScaleStation = useQuery([QUERY_KEY.dropdown_tram_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 50,
					keyword: '',
					companyUuid: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					isPaging: CONFIG_PAGING.NO_PAGING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
				}),
			}),
		select(data) {
			return data;
		},
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

	const listTown = useQuery([QUERY_KEY.dropdown_xa_phuong, form.provinceId], {
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

	const funcUpdateWarehouse = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa kho hàng thành công!',
				http: warehouseServices.upsertWarehouse({
					uuid: form.uuid,
					name: form.name,
					provinceId: form.provinceId,
					townId: form.townId,
					address: form.address,
					description: form.description,
					scaleStationUuid: form.scaleStationUuid,
					companyUuid: form.companyUuid,
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
		if (!form.companyUuid) {
			return toastWarn({msg: 'Vui lòng chọn KV cảng xuất khẩu!'});
		}

		return funcUpdateWarehouse.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcUpdateWarehouse.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Kho hàng chính</h4>
						<p>Điền đầy đủ các thông tin kho hàng chính</p>
					</div>
					<div className={styles.right}>
						<Button p_10_24 rounded_2 grey_outline onClick={() => router.back()}>
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
						max={255}
						type='text'
						blur={true}
						label={
							<span>
								Tên kho hàng <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập tên kho hàng'
					/>
					<div className={clsx('mt', 'col_2')}>
						<Select
							isSearch
							name='scaleStationUuid'
							value={form.scaleStationUuid}
							placeholder='Chọn trạm cân'
							label={<span>Trạm cân</span>}
						>
							{listScaleStation?.data?.map((v: any) => (
								<Option
									key={v?.uuid}
									value={v?.uuid}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											scaleStationUuid: v?.uuid,
										}))
									}
								/>
							))}
						</Select>
						<div>
							<Select
								isSearch
								name='companyUuid'
								value={form.companyUuid}
								placeholder='Chọn KV cảng xuất khẩu'
								onChange={(e) =>
									setForm((prev: any) => ({
										...prev,
										companyUuid: e.target.value,
									}))
								}
								label={
									<span>
										Thuộc KV cảng xuất khẩu <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listCompany?.data?.map((v: any) => (
									<Option key={v?.uuid} value={v?.uuid} title={v?.name} />
								))}
							</Select>
						</div>
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
							blur={true}
							max={255}
							value={form.address || ''}
							type='text'
							label={<span>Địa chỉ chi tiết</span>}
							placeholder='Nhập địa chỉ chi tiết'
						/>
					</div>
					<div className={clsx('mt')}>
						<TextArea max={5000} blur={true} name='description' placeholder='Nhập ghi chú' label={<span>Ghi chú</span>} />
					</div>
				</div>
			</Form>
		</div>
	);
}

export default MainUpdateWarehouse;
