import React, {useState} from 'react';

import {IPriceTagFuture, PropsMainFuturePricceTag} from './interfaces';
import styles from './MainFuturePricceTag.module.scss';
import Popup from '~/components/common/Popup';
import {useRouter} from 'next/router';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_CODE,
	REGENCY_NAME,
	TYPE_PRICE_FUTURE,
	TYPE_PRODUCT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Link from 'next/link';
import {convertCoin} from '~/common/funcs/convertCoin';
import Pagination from '~/components/common/Pagination';
import Moment from 'react-moment';
import priceTagServices from '~/services/priceTagServices';
import FormUpdateFuturePriceTag from '../FormUpdateFuturePriceTag';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';
import IconCustom from '~/components/common/IconCustom';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import Dialog from '~/components/common/Dialog';
import {CloseCircle} from 'iconsax-react';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import Loading from '~/components/common/Loading';

function MainFuturePricceTag({}: PropsMainFuturePricceTag) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {
		_page,
		_pageSize,
		_keyword,
		_specUuid,
		_productTypeUuid,
		_parentUserUuid,
		_userOwnerUuid,
		_userOwnerCompanyUuid,
		_transportType,
		_status,
	} = router.query;

	const [dataChangeFuture, setDataChangeFuture] = useState<any>(null);
	const [dataUpdate, setDataUpdate] = useState<any>(null);

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 100,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					type: [TYPE_PRODUCT.CONG_TY],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach], {
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
				}),
			}),
		select(data) {
			return data;
		},
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

	const funcChangeFuture = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'kết thúc giá tiền tương lai thành công!',
				http: priceTagServices.changeStatusFuturePrice({
					uuid: dataChangeFuture as string,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataChangeFuture(false);
				queryClient.invalidateQueries([QUERY_KEY.table_gia_tien_hang_tuong_lai]);
			}
		},
	});

	const listPriceTag = useQuery(
		[
			QUERY_KEY.table_gia_tien_hang_tuong_lai,
			_page,
			_pageSize,
			_keyword,
			_userOwnerUuid,
			_specUuid,
			_productTypeUuid,
			_transportType,
			_status,
			_userOwnerCompanyUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: priceTagServices.listFuturePrice({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						status: !!_status ? Number(_status) : null,
						specificationUuid: (_specUuid as string) || '',
						productTypeUuid: (_productTypeUuid as string) || '',
						transportType: !!_transportType ? Number(_transportType) : null,
						userOwnerCompanyUuid: (_userOwnerCompanyUuid as string) || '',
						userOwnerUuid: (_userOwnerUuid as string) || '',
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeFuture.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo nhà cung cấp' />
					</div>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Loại hàng'
							query='_productTypeUuid'
							listFilter={listProductType?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>

					{/* <div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Quy cách'
							query='_specUuid'
							listFilter={listSpecifications?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div> */}
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Vận chuyển'
							query='_transportType'
							listFilter={[
								{
									id: TYPE_TRANSPORT.DUONG_BO,
									name: 'Đường bộ',
								},
								{
									id: TYPE_TRANSPORT.DUONG_THUY,
									name: 'Đường thủy',
								},
							]}
						/>
					</div>
					{/* <div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div> */}
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_status'
							listFilter={[
								{
									id: TYPE_PRICE_FUTURE.CHUA_AP_DUNG,
									name: 'Chưa áp dụng',
								},
								{
									id: TYPE_PRICE_FUTURE.DANG_AP_DUNG,
									name: 'Đang áp dụng',
								},
								{
									id: TYPE_PRICE_FUTURE.DA_HUY,
									name: 'Đã hủy',
								},
								{
									id: TYPE_PRICE_FUTURE.DA_KET_THUC,
									name: 'Đã kết thúc',
								},
							]}
						/>
					</div>
					<CheckRegencyCode
						isPage={false}
						regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG]}
					>
						<>
							<div className={styles.filter}>
								<FilterCustom
									isSearch
									name='QLNH'
									query='_userOwnerCompanyUuid'
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
									query='_userOwnerUuid'
									listFilter={listUserMarket?.data?.map((v: any) => ({
										id: v?.uuid,
										name: v?.fullName,
									}))}
								/>
							</div>
						</>
					</CheckRegencyCode>
				</div>
				{/* <div>
					<Button
						p_8_16
						rounded_2
						href={PATH.ThemGiaTienHangTuongLai}
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
					>
						Thêm giá tiền
					</Button>
				</div> */}
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listPriceTag?.data?.items || []}
					loading={listPriceTag?.isLoading}
					// noti={<Noti titleButton='Thêm mới' onClick={() => router.push('')} des='Hiện tại chưa có giá tiền nào, thêm ngay?' />}
					noti={<Noti des='Hiện tại chưa có giá tiền nào, thêm ngay?' disableButton />}
				>
					<Table
						data={listPriceTag?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IPriceTagFuture, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Nhà cung cấp',
								fixedLeft: true,
								render: (data: IPriceTagFuture) => (
									<Link href={`/xuong/${data?.customerSpecUu?.customerUu?.uuid}`} className={styles.link}>
										{data?.customerSpecUu?.customerUu?.name || '---'}
									</Link>
								),
							},

							{
								title: 'Loại hàng',
								render: (data: IPriceTagFuture) => <>{data?.customerSpecUu?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Vận chuyển',
								render: (data: IPriceTagFuture) => (
									<>
										{data?.customerSpecUu?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.customerSpecUu?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Giá tiền (VNĐ)',
								render: (data: IPriceTagFuture) => <>{convertCoin(data?.pricetagUu?.amount) || 0} </>,
							},
							{
								title: 'Giá tiền sau ngày kết thúc (VNĐ)',
								render: (data: IPriceTagFuture) => <>{convertCoin(data?.pricetagAfterUu?.amount) || 0} </>,
							},
							// {
							// 	title: 'Công ty',
							// 	render: (data: IPriceTagFuture) => (
							// 		<Link href={`/nha-cung-cap/${data?.partnerUu?.uuid}`} className={styles.link}>
							// 			{data?.partnerUu?.name || '---'}
							// 		</Link>
							// 	),
							// },
							// {
							// 	title: 'Quy cách',
							// 	render: (data: IPriceTagFuture) => <>{data?.customerSpecUu?.specUu?.name || '---'}</>,
							// },

							{
								title: 'Ngày áp dụng',
								render: (data: IPriceTagFuture) =>
									data.timeStart ? <Moment date={data.timeStart} format='HH:mm, DD/MM/YYYY' /> : '---',
							},
							{
								title: 'Ngày kết thúc',
								render: (data: IPriceTagFuture) =>
									data.timeEnd ? <Moment date={data.timeEnd} format='HH:mm, DD/MM/YYYY' /> : '---',
							},
							{
								title: 'Trạng thái',
								render: (data: IPriceTagFuture) => (
									<>
										{data?.status == TYPE_PRICE_FUTURE.CHUA_AP_DUNG && (
											<span style={{color: '#9757D7'}}>Chưa áp dụng</span>
										)}
										{data?.status == TYPE_PRICE_FUTURE.DA_HUY && <span style={{color: '#D94212'}}>Đã hủy</span>}
										{data?.status == TYPE_PRICE_FUTURE.DA_KET_THUC && (
											<span style={{color: '#3772FF'}}>Đã kết thúc</span>
										)}
										{data?.status == TYPE_PRICE_FUTURE.DANG_AP_DUNG && (
											<span style={{color: '#2CAE39'}}>Đang áp dụng</span>
										)}
									</>
								),
							},
							// {
							// 	title: 'Tình trạng',
							// 	render: (data: IPriceTagFuture) => (
							// 		<>
							// 			{data?.state == CONFIG_STATUS.HOAT_DONG && <span style={{color: '#2CAE39'}}>Đang mở </span>}
							// 			{data?.state == CONFIG_STATUS.BI_KHOA && <span style={{color: '#D94212'}}>Đã hủy</span>}
							// 		</>
							// 	),
							// },
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IPriceTagFuture) => (
									<>
										{data?.status == TYPE_PRICE_FUTURE.CHUA_AP_DUNG ||
										data?.status == TYPE_PRICE_FUTURE.DANG_AP_DUNG ? (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												<IconCustom
													edit
													icon={<CloseCircle fontSize={22} fontWeight={600} />}
													tooltip={'Kết thúc'}
													color='#777E90'
													onClick={() => {
														setDataChangeFuture(data?.uuid);
													}}
												/>
											</div>
										) : (
											''
										)}
									</>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listPriceTag?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[
						_pageSize,
						_keyword,
						_specUuid,
						_productTypeUuid,
						_transportType,
						_status,
						_userOwnerUuid,
						_userOwnerCompanyUuid,
					]}
				/>
			</div>

			<Dialog
				danger
				open={!!dataChangeFuture}
				onClose={() => setDataChangeFuture(null)}
				title={'Khóa giá tiền tương lai'}
				note={'Bạn có chắc muốn khóa giá tiền tương lai này không??'}
				onSubmit={funcChangeFuture.mutate}
			/>

			{/* Popup */}
			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<FormUpdateFuturePriceTag dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>
		</div>
	);
}

export default MainFuturePricceTag;
