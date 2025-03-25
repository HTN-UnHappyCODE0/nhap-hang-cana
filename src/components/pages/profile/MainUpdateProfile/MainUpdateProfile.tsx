import React, {useState} from 'react';

import {IFormUpdate, PropsMainUpdateProfile} from './interfaces';
import styles from './MainUpdateProfile.module.scss';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import Form, {FormContext, Input} from '~/components/common/Form';
import clsx from 'clsx';
import Select, {Option} from '~/components/common/Select';
import DatePicker from '~/components/common/DatePicker';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, GENDER, QUERY_KEY, REGENCY_NAME} from '~/constants/config/enum';
import TextArea from '~/components/common/Form/components/TextArea';
import {useMutation, useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import regencyServices from '~/services/regencyServices';
import userServices from '~/services/userServices';
import commonServices from '~/services/commonServices';
import {toastWarn} from '~/common/funcs/toast';
import moment from 'moment';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import {timeSubmit} from '~/common/funcs/optionConvert';
import AvatarChange from '~/components/common/AvatarChange';
import {useSelector} from 'react-redux';
import {RootState, store} from '~/redux/store';
import {setInfoUser} from '~/redux/reducer/user';
import uploadImageService from '~/services/uploadService';

function MainUpdateProfile({}: PropsMainUpdateProfile) {
	const router = useRouter();

	const {_id} = router.query;

	const {infoUser} = useSelector((state: RootState) => state.user);

	const [file, setFile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [form, setForm] = useState<IFormUpdate>({
		fullName: '',
		phoneNumber: '',
		email: '',
		birthDay: '',
		address: '',
		description: '',
		accountUsername: '',
		regencyUuid: '',
		sex: GENDER.NAM,
		linkImage: '',
		ownerUuid: '',
		provinceId: '',
		districtId: '',
		townId: '',
		provinceOwnerId: '',
	});

	useQuery([QUERY_KEY.chi_tiet_nhan_vien], {
		queryFn: () =>
			httpRequest({
				http: userServices.detailUser({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			setForm({
				fullName: data?.fullName,
				phoneNumber: data?.phoneNumber,
				email: data?.email,
				birthDay: data?.birthDay,
				address: data?.address,
				description: data?.description,
				accountUsername: data?.accountUsername,
				regencyUuid: data?.regencyUu?.uuid,
				sex: data?.sex,
				linkImage: data?.linkImage,
				ownerUuid: data?.userOwnerUu?.uuid,
				provinceId: data?.detailAddress?.province?.uuid,
				districtId: data?.detailAddress?.district?.uuid,
				townId: data?.detailAddress?.town?.uuid,
				provinceOwnerId: data?.provinceOwner || '',
			});
		},
		select(data) {
			return data;
		},
		enabled: !!_id,
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

	const listDistrict = useQuery([QUERY_KEY.dropdown_quan_huyen, form.provinceId], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listDistrict({
					keyword: '',
					status: null,
					idParent: form?.provinceId,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.provinceId,
	});

	const listTown = useQuery([QUERY_KEY.dropdown_xa_phuong, form?.districtId], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listTown({
					keyword: '',
					status: null,
					idParent: form.districtId,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form?.districtId,
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

	const listUserManager = useQuery([QUERY_KEY.dropdown_nguoi_quan_ly_nhan_vien], {
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

	const funUpdateUser = useMutation({
		mutationFn: (body: {path: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Chỉnh sửa nhân viên thành công!',
				http: userServices.upsertUser({
					uuid: _id as string,
					fullName: form.fullName,
					phoneNumber: form.phoneNumber,
					email: form.email,
					birthDay: moment(form.birthDay).format('YYYY-MM-DD'),
					address: form.address,
					description: form.description,
					accountUsername: '',
					regencyUuid: form.regencyUuid,
					sex: form.sex,
					linkImage: body.path,
					ownerUuid:
						form.regencyUuid == listRegency?.data?.find((x: any) => x?.code == REGENCY_NAME['Nhân viên thị trường'])?.uuid
							? form.ownerUuid
							: '',
					provinceId: form.provinceId,
					districtId: form.districtId,
					townId: form.townId,
					provinceOwnerId:
						form.regencyUuid == listRegency?.data?.find((x: any) => x?.code == REGENCY_NAME['Nhân viên thị trường'])?.uuid ||
						form.regencyUuid == listRegency?.data?.find((x: any) => x?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid
							? form.provinceOwnerId
							: '',
				}),
			}),
		onSuccess(data, variables) {
			if (data) {
				store.dispatch(
					setInfoUser({
						avatar: variables?.path || '',
						regencyCode: infoUser?.regencyCode || null,
						userUuid: infoUser?.userUuid || '',
						uuid: infoUser?.uuid || '',
						userName: infoUser?.userName || '',
						fullname: form.fullName || '',
						companyUuid: infoUser?.companyUuid || '',
					})
				);
				router.replace(PATH.Profile, undefined, {
					scroll: false,
					locale: false,
				});
			}
		},
	});

	const handleSubmit = async () => {
		const today = new Date(timeSubmit(new Date())!);
		const birthDay = new Date(form.birthDay);

		if (!form.regencyUuid) {
			return toastWarn({msg: 'Vui lòng chọn chức vụ!'});
		}
		if (!form.birthDay) {
			return toastWarn({msg: 'Vui lòng chọn ngày sinh!'});
		}

		if (today < birthDay) {
			return toastWarn({msg: 'Ngày sinh không hợp lệ!'});
		}

		if (!!file) {
			const dataImage = await httpRequest({
				setLoading,
				isData: true,
				http: uploadImageService.uploadSingleImage(file),
			});

			if (dataImage?.error?.code == 0) {
				return funUpdateUser.mutate({
					path: dataImage.data,
				});
			} else {
				return toastWarn({msg: 'Upload ảnh thất bại!'});
			}
		} else {
			return funUpdateUser.mutate({path: infoUser?.avatar || ''});
		}
	};

	return (
		<div className={styles.container}>
			<Loading loading={funUpdateUser.isLoading || loading} />

			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Chỉnh sửa thông tin tài khoản</h4>
						<p>Điền đầy đủ các thông tin tài khoản</p>
					</div>
					<div className={styles.right}>
						<Button href={PATH.Profile} p_10_24 rounded_2 grey_outline>
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
				<div className={'mt'}>
					<AvatarChange
						path={`${process.env.NEXT_PUBLIC_IMAGE}/${form?.linkImage}`}
						name='avatar'
						onSetFile={(file) => setFile(file)}
					/>
				</div>
				<div className={clsx('col_2', 'mt')}>
					<Input
						name='fullName'
						value={form.fullName || ''}
						isRequired={true}
						max={255}
						blur={true}
						label={
							<span>
								Họ và tên <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập tên nhân viên'
					/>
					<Select
						isSearch
						name='regencyUuid'
						readOnly={true}
						placeholder='Chọn chức vụ'
						value={form?.regencyUuid}
						label={
							<span>
								Chức vụ <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listRegency?.data?.map((v: any) => (
							<Option
								key={v?.uuid}
								value={v?.uuid}
								title={v?.name}
								onClick={() => {
									setForm((prev: any) => ({
										...prev,
										regencyUuid: v?.uuid,
										ownerUuid: '',
										provinceOwnerId: '',
									}));
								}}
							/>
						))}
					</Select>
				</div>
				<div className={clsx('mt', 'col_2')}>
					<Select
						isSearch
						name='ownerUuid'
						readOnly={true}
						placeholder='Chọn người quản lý'
						value={form?.ownerUuid}
						onChange={(e: any) =>
							setForm((prev: any) => ({
								...prev,
								ownerUuid: e.target.value,
							}))
						}
						label={
							<span>
								Người quản lý <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
						{listUserManager?.data?.map((v: any) => (
							<Option key={v?.uuid} value={v?.uuid} title={v?.fullName} />
						))}
					</Select>
					<Input
						name='provinceOwnerId'
						value={form.provinceOwnerId || ''}
						readOnly={true}
						max={255}
						blur={true}
						label={
							<span>
								Khu vực quản lý <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Nhập khu vực quản lý'
					/>
				</div>
				<div className={clsx('mt', 'col_3')}>
					<Select
						isSearch
						name='provinceId'
						value={form.provinceId}
						placeholder='Chọn tỉnh/thành phố'
						label={
							<span>
								Tỉnh/Thành phố <span style={{color: 'red'}}>*</span>
							</span>
						}
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
										districtId: '',
										townId: '',
									}))
								}
							/>
						))}
					</Select>
					<div>
						<Select
							isSearch
							name='districtId'
							value={form.districtId}
							placeholder='Chọn quận/huyện'
							label={
								<span>
									Quận/Huyện <span style={{color: 'red'}}>*</span>
								</span>
							}
						>
							{listDistrict?.data?.map((v: any) => (
								<Option
									key={v?.maqh}
									value={v?.maqh}
									title={v?.name}
									onClick={() =>
										setForm((prev: any) => ({
											...prev,
											districtId: v?.maqh,
											townId: '',
										}))
									}
								/>
							))}
						</Select>
					</div>
					<Select
						isSearch
						name='townId'
						value={form.townId}
						placeholder='Chọn xã/phường'
						label={
							<span>
								Xã/phường <span style={{color: 'red'}}>*</span>
							</span>
						}
					>
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
				<div className={clsx('mt')}>
					<Input placeholder='Nhập địa chỉ chi tiết' name='address' max={255} label={<span>Địa chỉ chi tiết</span>} blur={true} />
				</div>
				<div className={clsx('mt', 'col_2')}>
					<DatePicker
						icon={true}
						label={
							<span>
								Ngày sinh <span style={{color: 'red'}}>*</span>
							</span>
						}
						placeholder='Chọn ngày sinh'
						value={form.birthDay || ''}
						onSetValue={(date) =>
							setForm((prev: any) => ({
								...prev,
								birthDay: date,
							}))
						}
						name='birthDay'
						onClean={true}
					/>
					<div className={styles.gennder}>
						<label>
							Giới tính <span style={{color: 'red'}}>*</span>
						</label>
						<div className={styles.group_radio}>
							<div className={styles.item_radio}>
								<input
									id='male'
									className={styles.input_radio}
									type='radio'
									name='sex'
									value={form.sex}
									checked={form.sex == GENDER.NAM}
									onChange={(e) =>
										setForm((prev: any) => ({
											...prev,
											sex: GENDER.NAM,
										}))
									}
								/>
								<label className={styles.input_lable} htmlFor='male'>
									Nam
								</label>
							</div>

							<div className={styles.item_radio}>
								<input
									id='female'
									className={styles.input_radio}
									type='radio'
									name='sex'
									value={form.sex}
									checked={form.sex == GENDER.NU}
									onChange={(e) =>
										setForm((prev: any) => ({
											...prev,
											sex: GENDER.NU,
										}))
									}
								/>
								<label className={styles.input_lable} htmlFor='female'>
									Nữ
								</label>
							</div>
						</div>
					</div>
				</div>

				<div className={clsx('mt', 'col_2')}>
					<div>
						<Input
							name='email'
							value={form.email || ''}
							isRequired={true}
							blur={true}
							isEmail={true}
							max={255}
							label={
								<span>
									Email <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập Email'
						/>
					</div>
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

				<div className={clsx('mt')}>
					<TextArea max={5000} placeholder='Nhập ghi chú' name='description' label={<span>Ghi chú</span>} blur={true} />
				</div>
			</Form>
		</div>
	);
}

export default MainUpdateProfile;
