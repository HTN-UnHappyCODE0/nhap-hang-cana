import React, {useEffect, useState} from 'react';

import {PropsMainPageStatisticsByDay} from './interfaces';
import styles from './MainPageStatisticsByDay.module.scss';
import DataWrapper from '~/components/common/DataWrapper';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	TYPE_DATE,
	TYPE_DATE_SHOW,
	TYPE_FILTE_TIME,
	TYPE_PARTNER,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {convertWeight} from '~/common/funcs/optionConvert';

import Link from 'next/link';
import batchBillServices from '~/services/batchBillServices';
import companyServices from '~/services/companyServices';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import partnerServices from '~/services/partnerServices';
import storageServices from '~/services/storageServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import moment from 'moment';
import Search from '~/components/common/Search';
import commonServices from '~/services/commonServices';
import SelectFilterState from '~/components/common/SelectFilterState';
import wareServices from '~/services/wareServices';
import Loading from '~/components/common/Loading';
import regencyServices from '~/services/regencyServices';
import userServices from '~/services/userServices';
import Pagination from '~/components/common/Pagination';
import SelectFilterManyOption from '~/components/common/SelectFilterManyOption';

function MainPageStatisticsByDay({}: PropsMainPageStatisticsByDay) {
	const router = useRouter();

	const {_partnerUuid, _dateFrom, _dateTo} = router.query;

	const [listStatisticsByDay, setListStatisticsByDay] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [uuidProduct, setUuidProduct] = useState<string>('');
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [uuidTypeShow, setUuidTypeShow] = useState<string>(String(TYPE_FILTE_TIME.NGAY));
	const [userOwnerUuid, setUserOwnerUuid] = useState<string[]>([]);
	const [userPartnerUuid, setUserPartnerUuid] = useState<string[]>([]);
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [uuidStorage, setUuidStorage] = useState<string>('');
	const [uuidSpec, setUuidSpec] = useState<string>('');
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);
	const [listPartnerUuid, setListPartnerUuid] = useState<any[]>([]);
	const [provinceUuid, setProvinceUuid] = useState<string[]>([]);

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

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap, listCompanyUuid, userPartnerUuid], {
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
					listCompanyUuid: listCompanyUuid,
					listUserUuid: userPartnerUuid,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang, listPartnerUuid, listCompanyUuid, userOwnerUuid], {
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
					listPartnerUUid: listPartnerUuid,
					listCompanyUuid: listCompanyUuid,
					listUserUuid: userOwnerUuid,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listStorage = useQuery([QUERY_KEY.table_bai], {
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
					qualityUuid: '',
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
					type: [TYPE_PRODUCT.CONG_TY],
				}),
			}),
		select(data) {
			return data;
		},
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

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach, uuidProduct, uuidQuality], {
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
					qualityUuid: uuidQuality,
					productTypeUuid: uuidProduct,
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

	const listUserMarket = useQuery([QUERY_KEY.dropdown_nhan_vien_thi_truong, userPartnerUuid], {
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
					parentUuid: '',
					listParentUuid: userPartnerUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const formatTimeScale = (timeScale: string, typeShow: number) => {
		if (typeShow === TYPE_DATE_SHOW.HOUR) {
			return moment(timeScale).format('HH:mm');
		} else if (typeShow === TYPE_DATE_SHOW.DAY) {
			return moment(timeScale).format('DD/MM');
		} else if (typeShow === TYPE_DATE_SHOW.MONTH) {
			return moment(timeScale).format('MM-YYYY');
		}
		return moment(timeScale).format('YYYY');
	};

	useEffect(() => {
		if (listCompanyUuid) {
			setCustomerUuid([]);
		}
		if (listPartnerUuid) {
			setCustomerUuid([]);
		}
	}, [listCompanyUuid, listPartnerUuid]);

	useEffect(() => {
		if (listCompanyUuid) {
			setListPartnerUuid([]);
		}
	}, [listCompanyUuid]);

	useEffect(() => {
		if (uuidProduct) {
			setUuidSpec('');
		}
		if (uuidQuality) {
			setUuidSpec('');
		}
	}, [uuidProduct, uuidQuality]);

	useEffect(() => {
		if (userPartnerUuid) {
			setListPartnerUuid([]);
			setUserOwnerUuid([]);
		}
	}, [userPartnerUuid]);

	useEffect(() => {
		if (userOwnerUuid) {
			setCustomerUuid([]);
		}
	}, [userOwnerUuid]);

	const convertData = (data: any) => {
		return data?.lstProductDay?.reduce((acc: any, item: any) => {
			item?.customerDateWeightUu?.forEach((entry: any) => {
				const existingCustomer = acc.find((customer: any) => customer.customerUu?.uuid === entry.customerUu?.uuid);

				const timeEntry = {
					timeScale: formatTimeScale(item?.timeScale, data?.typeShow),
					weightMT: entry?.weightMT,
					weightBDMT: entry?.weightBDMT,
					drynessAvg: entry?.drynessAvg,
					weightBDMTAvg: entry?.weightBDMTAvg,
				};

				const totalInfo = data?.lstProductTotal?.find((total: any) => total?.customerUu?.uuid === entry?.customerUu?.uuid);

				if (existingCustomer) {
					existingCustomer.timeList.push(timeEntry);
				} else {
					acc.push({
						customerUu: entry?.customerUu,
						timeList: [timeEntry],
						weightMT: totalInfo?.weightMT || 0,
						weightBDMT: totalInfo?.weightBDMT || 0,
						drynessAvg: totalInfo?.drynessAvg || 0,
						weightBDMTAvg: totalInfo?.weightBDMTAvg || 0,
					});
				}
			});
			return acc;
		}, []);
	};

	const getListDashbroadCustomerBillIn = useQuery(
		[
			QUERY_KEY.table_thong_ke_theo_ngay,
			userOwnerUuid,
			uuidCompany,
			customerUuid,
			_partnerUuid,
			uuidStorage,
			_dateFrom,
			_dateTo,
			listCompanyUuid,
			listPartnerUuid,
			provinceUuid,
			uuidSpec,
			uuidProduct,
			uuidQuality,
			userPartnerUuid,
			uuidTypeShow,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					setLoading: setLoading,
					http: batchBillServices.dashbroadCustomerBillIn({
						companyUuid: uuidCompany,
						customerUuid: customerUuid,
						isShowBDMT: 0,
						partnerUuid: '',
						provinceId: provinceUuid,
						storageUuid: uuidStorage,
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						transportType: null,
						typeFindDay: 0,
						typeShow: Number(uuidTypeShow),
						userOwnerUuid: userOwnerUuid,
						userPartnerUuid: userPartnerUuid,
						warehouseUuid: '',
						listCompanyUuid: listCompanyUuid,
						listPartnerUuid: listPartnerUuid,
						specificationUuid: uuidSpec,
						productTypeUuid: uuidProduct,
						qualityUuid: uuidQuality,
					}),
				}),
			onSuccess(data) {
				if (data) {
					const newData = convertData(data);
					setListStatisticsByDay(newData);
					// setTotal(data?.pagination?.totalCount);
					// console.log('acb', data)
				}
			},
			select(data) {
				if (data) {
					return data;
				}
			},
		}
	);

	// useEffect(() => {
	// 	if(getListDashbroadCustomerBillIn){
	// 		setListStatisticsByDay(convertData(getListDashbroadCustomerBillIn?.data || []));}
	// }, [getListDashbroadCustomerBillIn]);

	const dynamicColumns =
		listStatisticsByDay?.[0]?.timeList?.map((item: any) => ({
			title: (
				<span className={styles.unit}>
					{item?.timeScale} <br /> (Tấn/%)
				</span>
			),
			render: (data: any) => {
				const matchedTime = data?.timeList?.find((t: any) => t?.timeScale === item?.timeScale);
				return (
					<span>
						<p>{convertWeight(matchedTime?.weightBDMT)}</p>{' '}
						<p style={{color: '#2367ed'}}>{matchedTime?.drynessAvg!?.toFixed(2) || '---'} %</p>
					</span>
				);
			},
		})) || [];

	useEffect(() => {
		if (listCompanyUuid) {
			setCustomerUuid([]);
		}
		if (listPartnerUuid) {
			setCustomerUuid([]);
		}
	}, [listCompanyUuid, listPartnerUuid]);

	return (
		<div className={styles.container}>
			{/* <Loading loading={getListDashbroadCustomerBillIn.isLoading} /> */}
			<div className={styles.header}>
				<div className={styles.main_search}>
					{/* <div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm ...' />
					</div> */}
					<SelectFilterManyOption
						splitCondition={(v) => v?.type === 0}
						splitGroupNames={['Kho xuất khẩu', 'Kho trung chuyển']}
						selectedIds={listCompanyUuid}
						setSelectedIds={setListCompanyUuid}
						listData={listCompany?.data}
						name='Kho'
					/>
					<SelectFilterMany
						selectedIds={userPartnerUuid}
						setSelectedIds={setUserPartnerUuid}
						listData={listUserPurchasing?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						name='QLNH'
					/>
					<SelectFilterMany
						selectedIds={userOwnerUuid}
						setSelectedIds={setUserOwnerUuid}
						listData={listUserMarket?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						name='Quản lý nhân viên thị trường'
					/>
					<SelectFilterMany
						selectedIds={listPartnerUuid}
						setSelectedIds={setListPartnerUuid}
						listData={listPartner?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Công ty'
					/>

					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='NCC'
					/>

					<SelectFilterMany
						selectedIds={provinceUuid}
						setSelectedIds={setProvinceUuid}
						listData={listProvince?.data?.map((v: any) => ({
							uuid: v?.matp,
							name: v?.name,
						}))}
						name='Tỉnh'
					/>
					<SelectFilterState
						uuid={uuidProduct}
						setUuid={setUuidProduct}
						listData={listProductType?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Loại hàng'
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
						uuid={uuidSpec}
						setUuid={setUuidSpec}
						listData={listSpecifications?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Quy cách'
					/>

					<div className={styles.filter}>
						<DateRangerCustom
							titleTime='Thời gian'
							typeDateDefault={TYPE_DATE.LAST_7_DAYS}
							typeDateNotShow={[TYPE_DATE.YESTERDAY, TYPE_DATE.TODAY]}
						/>
					</div>
					<SelectFilterState
						isShowAll={false}
						uuid={uuidTypeShow}
						setUuid={setUuidTypeShow}
						listData={[
							{
								uuid: String(TYPE_FILTE_TIME.NGAY),
								name: 'Ngày',
							},
							{
								uuid: String(TYPE_FILTE_TIME.TUAN),
								name: 'Tuần',
							},
							{
								uuid: String(TYPE_FILTE_TIME.THANG),
								name: 'Tháng',
							},
							{
								uuid: String(TYPE_FILTE_TIME.NAM),
								name: 'Năm',
							},
						]}
						placeholder='Dữ liệu TB theo'
					/>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listStatisticsByDay || []}
					loading={loading}
					noti={<Noti des='Hiện tại chưa có danh sách thống kê theo ngày nào!' disableButton />}
				>
					<Table
						data={listStatisticsByDay || []}
						onSetData={setListStatisticsByDay}
						column={[
							{
								title: 'STT',
								fixedLeft: true,
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Nhà cung cấp',
								fixedLeft: true,
								render: (data: any) => (
									<p className={styles.name}>
										<Link href={`/xuong/${data?.customerUu?.uuid}`} className={styles.link}>
											{data?.customerUu?.name || '---'}
										</Link>
									</p>
								),
							},

							{
								title: (
									<span className={styles.unit}>
										Sản lượng TB <br />
										(Tấn)
									</span>
								),
								fixedLeft: true,
								render: (data: any) => <>{convertWeight(data?.weightBDMTAvg)}</>,
							},
							{
								title: (
									<span className={styles.unit}>
										Độ khô TB <br />
										(%)
									</span>
								),
								fixedLeft: true,
								render: (data: any) => <p style={{color: '#2367ed'}}>{data?.drynessAvg!?.toFixed(2)} %</p>,
							},
							{
								title: (
									<span className={styles.unit}>
										Tổng lượng <br />
										(Tấn)
									</span>
								),
								render: (data: any) => <>{convertWeight(data?.weightBDMT)}</>,
							},
							// {
							// 	groupTitle: 'Thông tin sản xuất', // ✅ Tiêu đề nhóm
							// 	children: [
							// 		{
							// 			title: 'Xưởng sản xuất',
							// 			fixedLeft: true,
							// 			render: (data: any) => <p className={styles.link}>{data?.customerUu?.name}</p>,
							// 		},
							// 		{
							// 			title: 'Sản lượng trung bình (Tấn)',
							// 			render: (data: any) => <>{convertWeight(data?.abc)}</>,
							// 		},
							// 	],
							// },

							...dynamicColumns,
						]}
					/>
				</DataWrapper>

				{/* {!queryWeightsession.isFetching && ( */}
			</div>
		</div>
	);
}

export default MainPageStatisticsByDay;
