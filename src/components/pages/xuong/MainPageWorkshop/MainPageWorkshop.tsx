import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {ICustomer, PropsMainPageWorkshop} from './interfaces';
import styles from './MainPageWorkshop.module.scss';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
	TYPE_PARTNER,
} from '~/constants/config/enum';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {PATH} from '~/constants/config';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import TagStatus from '~/components/common/TagStatus';
import Link from 'next/link';
// import {Lock1, Personalcard, Trash, Unlock} from 'iconsax-react';
import Pagination from '~/components/common/Pagination';
import Dialog from '~/components/common/Dialog';
import partnerServices from '~/services/partnerServices';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';

function MainPageWorkshop({}: PropsMainPageWorkshop) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {_page, _pageSize, _status, _keyword, _partnerUuid, _parentUserUuid, _userUuid} = router.query;
	// const [customerUuid, setCustomerUuid] = useState<string>('');
	const [dataStatusCustomer, setDataStatusCustomer] = useState<ICustomer | null>(null);

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

	const listUserPurchasing = useQuery([QUERY_KEY.dropdown_quan_ly_nhap_hang], {
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
					regencyUuid: [listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid],
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const listUserMarket = useQuery([QUERY_KEY.dropdown_nhan_vien_thi_truong, _parentUserUuid], {
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
					regencyUuid: [listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Nhân viên thị trường'])?.uuid],
					parentUuid: (_parentUserUuid as string) || '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const listCustomer = useQuery(
		[QUERY_KEY.table_khach_hang_doi_tac, _parentUserUuid, _userUuid, _status, _keyword, _page, _pageSize, _partnerUuid],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: customerServices.listCustomer({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						specUuid: '',
						provinceId: '',
						status: !!_status ? Number(_status) : null,
						typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
						partnerUUid: (_partnerUuid as string) || null,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						isPaging: CONFIG_PAGING.IS_PAGING,
						userUuid: (_userUuid as string) || '',
						parentUserUuid: (_parentUserUuid as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap], {
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
					type: TYPE_PARTNER.NCC,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const funcChangeStatusCustomer = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: dataStatusCustomer?.status == STATUS_CUSTOMER.HOP_TAC ? 'Khóa thành công' : 'Mở khóa thành công',
				http: customerServices.changeStatus({
					uuid: dataStatusCustomer?.uuid!,
					status: dataStatusCustomer?.status! == STATUS_CUSTOMER.HOP_TAC ? STATUS_CUSTOMER.DUNG_HOP_TAC : STATUS_CUSTOMER.HOP_TAC,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatusCustomer(null);
				queryClient.invalidateQueries([QUERY_KEY.table_khach_hang_doi_tac]);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nha_cung_cap]);
			}
		},
	});

	useEffect(() => {
		if (_parentUserUuid) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						_userUuid: null,
					},
				},
				undefined,
				{shallow: true, scroll: false}
			);
		}
	}, [_parentUserUuid]);

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatusCustomer.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên NCC' />
					</div>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='QLNH'
							query='_parentUserUuid'
							listFilter={listUserPurchasing?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.fullName,
							}))}
						/>
					</div>
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Nhân viên thị trường'
							query='_userUuid'
							listFilter={listUserMarket?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.fullName,
							}))}
						/>
					</div>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Công ty'
							query='_partnerUuid'
							listFilter={listPartner?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_status'
							listFilter={[
								{
									id: STATUS_CUSTOMER.DUNG_HOP_TAC,
									name: 'Bị khóa',
								},
								{
									id: STATUS_CUSTOMER.HOP_TAC,
									name: 'Hoạt động',
								},
								{
									id: STATUS_CUSTOMER.DA_XOA,
									name: 'Đã xóa',
								},
							]}
						/>
					</div>
				</div>

				{/* <div className={styles.btn}>
					<Button
						href={PATH.ThemMoiXuong}
						p_8_16
						rounded_2
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
					>
						Thêm NCC
					</Button>
				</div> */}
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listCustomer.data?.items || []}
					loading={listCustomer.isLoading}
					noti={<Noti disableButton des='Hiện tại chưa có NCC nào!' />}
				>
					<Table
						data={listCustomer.data?.items || []}
						column={[
							{
								title: 'Mã NCC',
								render: (data: any) => <>{data.code}</>,
							},
							{
								title: 'Tên NCC',
								fixedLeft: true,
								render: (data: any) => (
									<Link href={`/xuong/${data?.uuid}`} className={styles.link}>
										{data?.name || '---'}
									</Link>
								),
							},
							{
								title: 'Tên công ty',
								render: (data: any) => <>{data.partnerUu?.name || '---'}</>,
							},

							{
								title: 'Kho hàng',
								render: (data: any) => <>{data?.warehouseUu?.name || '---'}</>,
							},
							{
								title: 'Số điện thoại',
								render: (data: any) => <>{data.phoneNumber || '---'}</>,
							},
							{
								title: 'Email',
								render: (data: any) => <>{data.email || '---'}</>,
							},
							{
								title: 'Nhân viên',
								render: (data: any) => <>{data?.userUu?.fullName || '---'}</>,
							},
							{
								title: 'Trạng thái',
								render: (data: any) => <TagStatus status={data?.status} />,
							},
							// {
							// 	title: 'Tác vụ',
							// 	fixedRight: true,
							// 	render: (data: any) => (
							// 		<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
							// 			<IconCustom
							// 				edit
							// 				icon={<LuPencil fontSize={20} fontWeight={600} />}
							// 				tooltip='Chỉnh sửa'
							// 				color='#777E90'
							// 				href={`${PATH.ChinhSuaXuong}?_customerUuid=${data?.uuid}`}
							// 			/>

							// 			{/* <IconCustom
							// 				lock
							// 				icon={data?.status == STATUS_CUSTOMER.HOP_TAC ? <Lock1 size={20} /> : <Unlock size={20} />}
							// 				tooltip={data?.status == STATUS_CUSTOMER.HOP_TAC ? '' : ''}
							// 				color='#777E90'
							// 				onClick={() => setDataStatusCustomer(data)}
							// 			/> */}
							// 			<IconCustom
							// 				lock
							// 				icon={
							// 					data?.status == STATUS_CUSTOMER.HOP_TAC ? (
							// 						<HiOutlineLockClosed size='22' />
							// 					) : (
							// 						<HiOutlineLockOpen size='22' />
							// 					)
							// 				}
							// 				tooltip={data.status == STATUS_CUSTOMER.HOP_TAC ? 'Khóa NCC' : 'Mở khóa NCC'}
							// 				color='#777E90'
							// 				onClick={() => {
							// 					setDataStatusCustomer(data);
							// 				}}
							// 			/>
							// 		</div>
							// 	),
							// },
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listCustomer?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _status, _keyword, _partnerUuid]}
				/>
				<Dialog
					danger
					open={!!dataStatusCustomer}
					onClose={() => setDataStatusCustomer(null)}
					title={dataStatusCustomer?.status == STATUS_CUSTOMER.HOP_TAC ? 'Khóa hoạt động' : 'Mở khóa hoạt động'}
					note={
						dataStatusCustomer?.status == STATUS_CUSTOMER.HOP_TAC
							? 'Bạn có chắc chắn muốn khóa hoạt động NCC này?'
							: 'Bạn có chắc chắn muốn mở khóa hoạt động NCC này?'
					}
					onSubmit={funcChangeStatusCustomer.mutate}
				/>
			</div>
		</div>
	);
}

export default MainPageWorkshop;
