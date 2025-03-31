import React, {useEffect, useState} from 'react';

import {ITableBillImportCustomer, PropsTableImport} from './interfaces';
import styles from './TableImport.module.scss';
import Search from '~/components/common/Search';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import DataWrapper from '~/components/common/DataWrapper';
import {useRouter} from 'next/router';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATE_BILL,
	STATUS_BILL,
	TYPE_BATCH,
	TYPE_DATE,
	TYPE_PRODUCT,
	TYPE_SCALES,
	TYPE_SIFT,
} from '~/constants/config/enum';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import debtBillServices from '~/services/debtBillServices';
import Pagination from '~/components/common/Pagination';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import {convertCoin} from '~/common/funcs/convertCoin';
import Table from '~/components/common/Table';
import Moment from 'react-moment';
import Noti from '~/components/common/DataWrapper/components/Noti';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import FilterCustom from '~/components/common/FilterCustom';
import companyServices from '~/services/companyServices';
import wareServices from '~/services/wareServices';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import batchBillServices from '~/services/batchBillServices';
import storageServices from '~/services/storageServices';
import customerServices from '~/services/customerServices';
import scalesStationServices from '~/services/scalesStationServices';
import truckServices from '~/services/truckServices';
import shipServices from '~/services/shipServices';
import Link from 'next/link';
import StateActive from '~/components/common/StateActive';

function TableImport({uuid}: PropsTableImport) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isHaveDryness, setIsHaveDryness] = useState<string>('');
	const [truckUuid, setTruckUuid] = useState<string[]>([]);

	const [openWeighReject, setOpenWeighReject] = useState<string | null>(null);

	const {_page, _pageSize, _keyword, _isBatch, _productTypeUuid, _shipUuid, _status, _dateFrom, _dateTo, _state, _scalesStationUuid} =
		router.query;

	const [uuidPlay, setUuidPlay] = useState<string>('');
	const [uuidStop, setUuidStop] = useState<string>('');
	const [billUuidUpdateShip, setBillUuidUpdateShip] = useState<string | null>(null);
	const [openExportExcel, setOpenExportExcel] = useState<boolean>(false);
	const [listBatchBill, setListBatchBill] = useState<any[]>([]);
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [uuidStorage, setUuidStorage] = useState<string>('');

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

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang, listCompanyUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: null,
					typeCus: null,
					provinceId: '',
					specUuid: '',
					companyUuid: '',
					listCompanyUuid: listCompanyUuid,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listScalesStation = useQuery([QUERY_KEY.table_tram_can], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: scalesStationServices.listScalesStation({
					page: 1,
					pageSize: 50,
					keyword: '',
					companyUuid: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listTruck = useQuery([QUERY_KEY.dropdown_xe_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: truckServices.listTruck({
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

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					type: [TYPE_PRODUCT.CONG_TY, TYPE_PRODUCT.DUNG_CHUNG],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listShip = useQuery([QUERY_KEY.dropdown_ma_tau], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: shipServices.listShip({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
				}),
			}),

		select(data) {
			return data;
		},
	});

	const listStorage = useQuery([QUERY_KEY.table_bai, uuidQuality], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					warehouseUuid: '',
					productUuid: '',
					qualityUuid: uuidQuality,
					specificationsUuid: '',
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			if (data) {
				return data;
			}
		},
	});

	const getListBatch = useQuery(
		[
			QUERY_KEY.table_phieu_can_tat_ca,
			_page,
			_pageSize,
			_keyword,
			_isBatch,
			_productTypeUuid,
			_shipUuid,
			_status,
			_dateFrom,
			_dateTo,
			_state,
			uuidStorage,
			_scalesStationUuid,
			isHaveDryness,
			truckUuid,
			uuidCompany,
			uuidQuality,
			listCompanyUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: batchBillServices.getListBill({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						scalesType: [],
						state: !!_state
							? [Number(_state)]
							: [
									STATE_BILL.NOT_CHECK,
									STATE_BILL.QLK_REJECTED,
									STATE_BILL.QLK_CHECKED,
									STATE_BILL.KTK_REJECTED,
									STATE_BILL.KTK_CHECKED,
									STATE_BILL.END,
							  ],
						isBatch: !!_isBatch ? Number(_isBatch) : null,
						isCreateBatch: null,
						productTypeUuid: (_productTypeUuid as string) || '',
						specificationsUuid: '',
						status: !!_status
							? [Number(_status)]
							: [
									STATUS_BILL.DANG_CAN,
									STATUS_BILL.TAM_DUNG,
									STATUS_BILL.DA_CAN_CHUA_KCS,
									STATUS_BILL.DA_KCS,
									STATUS_BILL.CHOT_KE_TOAN,
							  ],
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						warehouseUuid: '',
						qualityUuid: uuidQuality,
						transportType: null,
						shipUuid: (_shipUuid as string) || '',
						typeCheckDay: 0,
						scalesStationUuid: (_scalesStationUuid as string) || '',
						storageUuid: uuidStorage,
						isHaveDryness: isHaveDryness ? Number(isHaveDryness) : null,
						truckUuid: truckUuid,
						customerUuid: '',
						listCustomerUuid: [uuid as string],
						companyUuid: uuidCompany,
						listCompanyUuid: listCompanyUuid,
					}),
				}),
			onSuccess(data) {
				if (data) {
					setListBatchBill(
						data?.items?.map((v: any, index: number) => ({
							...v,
							index: index,
							isChecked: false,
						}))
					);
					setTotal(data?.pagination?.totalCount);
				}
			},
			select(data) {
				return data;
			},
		}
	);

	return (
		<FlexLayout isPage={false}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo mã lô hàng' />
					</div>

					{/* <SelectFilterState
						uuid={uuidCompany}
						setUuid={setUuidCompany}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Kv cảng xuất khẩu'
					/> */}
					<SelectFilterMany
						selectedIds={listCompanyUuid}
						setSelectedIds={setListCompanyUuid}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Kv cảng xuất khẩu'
					/>

					<FilterCustom
						isSearch
						name='Loại hàng'
						query='_productTypeUuid'
						listFilter={listProductType?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>

					<FilterCustom
						isSearch
						name='Mã tàu'
						query='_shipUuid'
						listFilter={listShip?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.licensePalate,
						}))}
					/>

					<SelectFilterState
						uuid={uuidQuality}
						setUuid={setUuidQuality}
						listData={listQuality?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Quốc gia'
					/>
					<SelectFilterState
						uuid={uuidStorage}
						setUuid={setUuidStorage}
						listData={listStorage?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Bãi'
					/>

					<SelectFilterState
						uuid={isHaveDryness}
						setUuid={setIsHaveDryness}
						listData={[
							{
								uuid: String(0),
								name: 'Chưa có',
							},
							{
								uuid: String(1),
								name: 'Đã có',
							},
						]}
						placeholder='Độ khô'
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div>
				</div>
			</div>
			<FullColumnFlex>
				<div className={styles.table}>
					<DataWrapper
						data={listBatchBill || []}
						loading={getListBatch?.isFetching}
						noti={<Noti des='Hiện tại chưa có phiếu cân nào, thêm ngay?' disableButton />}
					>
						<Table
							data={listBatchBill || []}
							onSetData={setListBatchBill}
							column={[
								{
									title: 'STT',
									render: (data: ITableBillImportCustomer, index: number) => <>{index + 1}</>,
								},
								{
									title: 'Mã lô',
									fixedLeft: true,
									render: (data: ITableBillImportCustomer) => (
										<>
											{data?.isBatch == TYPE_BATCH.KHONG_CAN ? (
												<Link href={`/nhap-xuat-ngoai/${data.uuid}`} className={styles.link}>
													{data?.code}
												</Link>
											) : (
												<Link href={`/phieu-can/${data.uuid}`} className={styles.link}>
													{data?.code}
												</Link>
											)}
										</>
									),
								},
								{
									title: 'Loại cân',
									render: (data: ITableBillImportCustomer) => (
										<p style={{fontWeight: 600}}>
											{data?.scalesType == TYPE_SCALES.CAN_NHAP && 'Cân nhập'}
											{data?.scalesType == TYPE_SCALES.CAN_XUAT && 'Cân xuất'}
											{data?.scalesType == TYPE_SCALES.CAN_DICH_VU && 'Cân dịch vụ'}
											{data?.scalesType == TYPE_SCALES.CAN_CHUYEN_KHO && 'Cân chuyển kho'}
											{data?.scalesType == TYPE_SCALES.CAN_TRUC_TIEP && 'Cân xuất thẳng'}
										</p>
									),
								},

								{
									title: 'Đến',
									render: (data: ITableBillImportCustomer) => (
										<>
											<p style={{marginBottom: 4, fontWeight: 600}}>{data?.toUu?.name || '---'}</p>
											{data?.scalesType == TYPE_SCALES.CAN_XUAT &&
												(data?.isBatch == TYPE_BATCH.CAN_LO ? (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.numShip || '---'} . {data?.batchsUu?.shipUu?.licensePalate || '---'}
													</p>
												) : (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.batchsUu?.shipUu?.licensePalate || '---'}
													</p>
												))}
											{!(data?.scalesType == TYPE_SCALES.CAN_XUAT) &&
												(data?.isBatch == TYPE_BATCH.CAN_LO ? (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.numShip || '---'} . {data?.batchsUu?.shipOutUu?.licensePalate || '---'}
													</p>
												) : (
													<p style={{fontWeight: 400, color: '#3772FF'}}>
														{data?.batchsUu?.shipOutUu?.licensePalate || '---'}
													</p>
												))}
										</>
									),
								},
								{
									title: 'KL hàng (Tấn)',
									render: (data: ITableBillImportCustomer) => <>{convertWeight(data?.weightTotal) || 0}</>,
								},
								{
									title: 'KL 1 (Tấn)',
									render: (data: ITableBillImportCustomer) => <>{convertWeight(data?.weigth1) || 0}</>,
								},
								{
									title: 'KL 2 (Tấn)',
									render: (data: ITableBillImportCustomer) => <>{convertWeight(data?.weigth2) || 0}</>,
								},
								{
									title: 'Độ khô (%)',
									render: (data: ITableBillImportCustomer) => <>{data?.drynessAvg?.toFixed(2) || 0}</>,
								},
								{
									title: 'Giá tiền hàng (VNĐ)',
									render: (data: ITableBillImportCustomer) => <>{convertCoin(data?.pricetagUu?.amount) || 0}</>,
								},
								{
									title: 'Loại hàng',
									render: (data: ITableBillImportCustomer) => <>{data?.productTypeUu?.name || '---'}</>,
								},
							]}
						/>
					</DataWrapper>
					{!getListBatch.isFetching && (
						<Pagination
							currentPage={Number(_page) || 1}
							pageSize={Number(_pageSize) || 200}
							total={total}
							dependencies={[
								_pageSize,
								_keyword,
								_isBatch,
								_productTypeUuid,
								_shipUuid,
								_status,
								_dateFrom,
								_dateTo,
								_state,
								uuidQuality,
								uuidStorage,
								_scalesStationUuid,
								isHaveDryness,
								truckUuid,
								uuidCompany,
								uuidQuality,
								listCompanyUuid,
							]}
						/>
					)}
				</div>
			</FullColumnFlex>
		</FlexLayout>
	);
}

export default TableImport;
