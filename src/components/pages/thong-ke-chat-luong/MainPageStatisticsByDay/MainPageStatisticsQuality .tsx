import React, {useEffect, useState} from 'react';

import {PropsMainPageStatisticsQuality} from './interfaces';
import styles from './MainPageStatisticsQuality .module.scss';
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
import criteriaServices from '~/services/criteriaServices';

function MainPageStatisticsQuality({}: PropsMainPageStatisticsQuality) {
	const router = useRouter();

	const {_userOwnerUuid, _partnerUuid, _dateFrom, _dateTo} = router.query;

	const [listStatisticsByDay, setListStatisticsByDay] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [uuidProduct, setUuidProduct] = useState<string>('');
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [userOwnerUuid, setUserOwnerUuid] = useState<string>('');
	const [userPartnerUuid, setUserPartnerUuid] = useState<string>('');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [uuidStorage, setUuidStorage] = useState<string>('');
	const [uuidSpec, setUuidSpec] = useState<string>('');
	const [uuidCriteria, setUuidCriteria] = useState<string>('');
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);
	const [listPartnerUuid, setListPartnerUuid] = useState<any[]>([]);
	const [provinceUuid, setProvinceUuid] = useState<string>('');

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
					userUuid: userPartnerUuid,
					provinceId: '',
					type: TYPE_PARTNER.NCC,
					listCompanyUuid: listCompanyUuid,
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
					userUuid: userOwnerUuid,
					status: null,
					typeCus: null,
					provinceId: '',
					specUuid: '',
					listPartnerUUid: listPartnerUuid,
					listCompanyUuid: listCompanyUuid,
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
		onSuccess(data) {
			if (data) {
				setUuidProduct(data[0]?.uuid);
			}
		},
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
		onSuccess(data) {
			if (data) {
				setUuidQuality(data[0]?.uuid);
			}
		},
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
		onSuccess(data) {
			if (data) {
				setUuidSpec(data[0]?.uuid);
			}
		},
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

	const listUserMarket = useQuery([QUERY_KEY.dropdown_nhan_vien_thi_truong], {
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
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const listCriteria = useQuery([QUERY_KEY.dropdown_tieu_chi_quy_cach, uuidSpec], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: criteriaServices.listCriteria({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					specificationUuid: uuidSpec,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setUuidCriteria(data[0]?.uuid);
			}
		},
		select(data) {
			return data;
		},
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
			setUuidSpec(listSpecifications?.data?.[0]?.uuid || '');
		}
		if (uuidQuality) {
			setUuidSpec(listSpecifications?.data?.[0]?.uuid || '');
		}
	}, [uuidProduct, uuidQuality]);

	useEffect(() => {
		if (uuidSpec) {
			setUuidCriteria(listCriteria?.data?.[0]?.uuid || '');
		}
	}, [uuidSpec]);

	useEffect(() => {
		if (userPartnerUuid) {
			setListPartnerUuid([]);
		}
	}, [userPartnerUuid]);

	useEffect(() => {
		if (userOwnerUuid) {
			setCustomerUuid([]);
		}
	}, [userOwnerUuid]);

	const convertData = (data: any) => {
		return data?.lstInfoDaily?.reduce((acc: any, item: any) => {
			item?.customerDateWeightUu?.forEach((entry: any) => {
				const existingCustomer = acc.find((customer: any) => customer.customerUu?.uuid === entry.customerUu?.uuid);

				const timeEntry = {
					timeScale: formatTimeScale(item?.timeScale, data?.typeShow),
					weightMT: entry?.weightMT,
					weightAmount: entry?.weightAmount,
					percentAvg: entry?.percentAvg,
				};

				const totalInfo = data?.lstInfoTotal?.find((total: any) => total?.customerUu?.uuid === entry?.customerUu?.uuid);

				if (existingCustomer) {
					existingCustomer.timeList.push(timeEntry);
				} else {
					acc.push({
						customerUu: entry?.customerUu,
						timeList: [timeEntry],
						weightMT: totalInfo?.weightMT || 0,
						weightAmount: totalInfo?.weightAmount || 0,
						percentAvg: totalInfo?.percentAvg || 0,
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
			uuidCriteria,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					setLoading: setLoading,
					http: batchBillServices.dashbroadSpecBillIn({
						companyUuid: uuidCompany,
						customerUuid: customerUuid,
						isShowBDMT: 0,
						partnerUuid: '',
						provinceId: provinceUuid,
						storageUuid: uuidStorage,
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						transportType: 0,
						typeFindDay: 0,
						typeShow: 0,
						userOwnerUuid: userOwnerUuid,
						userPartnerUuid: userPartnerUuid,
						warehouseUuid: '',
						listCompanyUuid: listCompanyUuid,
						listPartnerUuid: listPartnerUuid,
						specificationUuid: uuidSpec,
						productTypeUuid: uuidProduct,
						qualityUuid: uuidQuality,
						criterialUuid: uuidCriteria,
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
					{item?.timeScale} <br /> (%)
				</span>
			),
			render: (data: any) => {
				const matchedTime = data?.timeList?.find((t: any) => t?.timeScale === item?.timeScale);
				return (
					<span>
						<p>{matchedTime?.percentAvg!?.toFixed(2) || '---'} %</p>
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
					<SelectFilterMany
						selectedIds={listCompanyUuid}
						setSelectedIds={setListCompanyUuid}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Kv cảng xuất khẩu'
					/>
					<SelectFilterState
						uuid={userPartnerUuid}
						setUuid={setUserPartnerUuid}
						listData={listUserPurchasing?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						placeholder='Tất cả quản lý công ty'
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
					<SelectFilterState
						uuid={userOwnerUuid}
						setUuid={setUserOwnerUuid}
						listData={listUserMarket?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						placeholder='Tất cả quản lý xưởng'
					/>
					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Nhà cung cấp'
					/>

					<SelectFilterState
						uuid={provinceUuid}
						setUuid={setProvinceUuid}
						listData={listProvince?.data?.map((v: any) => ({
							uuid: v?.matp,
							name: v?.name,
						}))}
						placeholder='Tất cả tỉnh thành'
					/>
					<SelectFilterState
						isShowAll={false}
						uuid={uuidProduct}
						setUuid={setUuidProduct}
						listData={listProductType?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả loại hàng'
					/>

					<SelectFilterState
						isShowAll={false}
						uuid={uuidQuality}
						setUuid={setUuidQuality}
						listData={listQuality?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Quốc gia'
					/>
					<SelectFilterState
						isShowAll={false}
						uuid={uuidSpec}
						setUuid={setUuidSpec}
						listData={listSpecifications?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả quy cách'
					/>
					<SelectFilterState
						isShowAll={false}
						uuid={uuidCriteria}
						setUuid={setUuidCriteria}
						listData={listCriteria?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.title,
						}))}
						placeholder='Tất cả tiêu chí'
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.YESTERDAY} />
					</div>
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
										Trung bình <br />
										(%)
									</span>
								),
								fixedLeft: true,
								render: (data: any) => <>{data?.percentAvg!?.toFixed(2)}</>,
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

export default MainPageStatisticsQuality;
