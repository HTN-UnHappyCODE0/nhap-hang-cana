import React, {useState} from 'react';

import {IPriceTagChangeHistory, PropsMainHistoryChangePriceTag} from './interfaces';
import styles from './MainHistoryChangePriceTag.module.scss';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import router from 'next/router';
import Table from '~/components/common/Table';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	TYPE_PRICE_FUTURE,
	TYPE_PRODUCT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import priceTagServices from '~/services/priceTagServices';
import {useQuery} from '@tanstack/react-query';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import userServices from '~/services/userServices';
import wareServices from '~/services/wareServices';
import regencyServices from '~/services/regencyServices';
import moment from 'moment';
import Link from 'next/link';
import {convertCoin} from '~/common/funcs/convertCoin';
import TagStatusSpecCustomer from '../MainPriceTagCurrent/TagStatusSpecCustomer';
import DatePickerFilter from '~/components/common/DatePickerFilter';
import SelectFilterState from '~/components/common/SelectFilterState';
import companyServices from '~/services/companyServices';

function MainHistoryChangePriceTag({}: PropsMainHistoryChangePriceTag) {
	const {_page, _pageSize, _keyword, _userOwnerCompanyUuid, _parentUserUuid, _productTypeUuid, _userOwnerUuid, _transportType, _status} =
		router.query;

	const [dateCheck, setDateCheck] = useState<Date | null>(null);
	const [uuidCompany, setUuidCompany] = useState<string>('');

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

	const listPriceTagChange = useQuery(
		[
			QUERY_KEY.table_gia_tien_lich_su,
			_page,
			_userOwnerUuid,
			_userOwnerCompanyUuid,
			_pageSize,
			_keyword,
			_productTypeUuid,
			_transportType,
			_status,
			dateCheck,
			uuidCompany,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: priceTagServices.listDailyPrice({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						// status: !!_status ? Number(_status) : null,
						status: CONFIG_STATUS.HOAT_DONG,
						productTypeUuid: (_productTypeUuid as string) || '',
						transportType: !!_transportType ? Number(_transportType) : null,
						userOwnerCompanyUuid: (_userOwnerCompanyUuid as string) || '',
						userOwnerUuid: (_userOwnerUuid as string) || '',
						dateCheck: dateCheck ? moment(dateCheck).format('YYYY-MM-DD') : null,
						companyUuid: uuidCompany,
					}),
				}),
			select(data) {
				return data;
			},
		}
	);
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo nhà cung cấp' />
					</div>

					<div className={styles.filter}>
						<SelectFilterState
							uuid={uuidCompany}
							setUuid={setUuidCompany}
							listData={listCompany?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Kv cảng xuất khẩu'
						/>
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

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Quản lý nhập hàng'
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

					<div className={styles.filter}>
						{/* <DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} /> */}
						<DatePickerFilter
							icon={true}
							placeholder='Hôm qua'
							value={dateCheck}
							onSetValue={setDateCheck}
							name='dateCheck'
							onClean={true}
						/>
					</div>
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
					data={listPriceTagChange?.data?.items || []}
					loading={listPriceTagChange?.isLoading}
					noti={<Noti disableButton title='Dữ liệu trống!' des='Hiện tại chưa có giá nào, thêm ngay?' />}
				>
					<Table
						data={listPriceTagChange?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IPriceTagChangeHistory, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Nhà cung cấp',
								render: (data: IPriceTagChangeHistory) => (
									<Link href={`/xuong/${data?.customerSpecUu?.customerUu?.uuid}`} className={styles.link}>
										{data?.customerSpecUu?.customerUu?.name || '---'}
									</Link>
								),
							},
							{
								title: 'Kv cảng xuất khẩu',
								render: (data: IPriceTagChangeHistory) => <>{data?.customerSpecUu?.customerUu?.companyUu?.name || '---'}</>,
							},
							{
								title: 'Giá tiền (VNĐ)',
								render: (data: IPriceTagChangeHistory) => <>{convertCoin(data?.pricetagUu?.amount) || 0} </>,
							},
							{
								title: 'Loại hàng',
								render: (data: IPriceTagChangeHistory) => <>{data?.customerSpecUu?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Vận chuyển',
								render: (data: IPriceTagChangeHistory) => (
									<>
										{data?.customerSpecUu?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.customerSpecUu?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Cung cấp',
								render: (data: IPriceTagChangeHistory) => <TagStatusSpecCustomer status={data?.customerSpecUu?.state} />,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listPriceTagChange?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[
						_pageSize,
						_keyword,
						_userOwnerCompanyUuid,
						_parentUserUuid,
						_productTypeUuid,
						_userOwnerUuid,
						_transportType,
						_status,
						uuidCompany,
					]}
				/>
			</div>
		</div>
	);
}

export default MainHistoryChangePriceTag;
