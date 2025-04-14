import React, {useEffect, useMemo, useState} from 'react';

import {PropsChartStackStatisticsByDay} from './interfaces';
import styles from './ChartStackStatisticsByDay.module.scss';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Scatter} from 'recharts';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_CODE,
	REGENCY_NAME,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_DATE_SHOW,
	TYPE_PARTNER,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';
import SelectFilterDate from '../SelectFilterDate';
import {timeSubmit} from '~/common/funcs/optionConvert';
import companyServices from '~/services/companyServices';
import moment from 'moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import wareServices from '~/services/wareServices';
import commonServices from '~/services/commonServices';
import partnerServices from '~/services/partnerServices';
import batchBillServices from '~/services/batchBillServices';
import criteriaServices from '~/services/criteriaServices';
import storageServices from '~/services/storageServices';
import {useRouter} from 'next/router';
import SelectFilterState from '~/components/common/SelectFilterState';
import SelectFilterMany from '~/components/common/SelectFilterMany/SelectFilterMany';

function ChartStackStatisticsByDay({}: PropsChartStackStatisticsByDay) {
	const router = useRouter();

	const [listStatisticsByDay, setListStatisticsByDay] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [uuidProduct, setUuidProduct] = useState<string>('');
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [userOwnerUuid, setUserOwnerUuid] = useState<string[]>([]);
	const [userPartnerUuid, setUserPartnerUuid] = useState<string[]>([]);
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [uuidStorage, setUuidStorage] = useState<string>('');
	const [uuidSpec, setUuidSpec] = useState<string>('');
	const [uuidCriteria, setUuidCriteria] = useState<string>('');
	const [listCompanyUuid, setListCompanyUuid] = useState<any[]>([]);
	const [listPartnerUuid, setListPartnerUuid] = useState<any[]>([]);
	const [provinceUuid, setProvinceUuid] = useState<string[]>([]);
	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.THIS_YEAR);
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);
	const [productTypes, setProductTypes] = useState<any[]>([]);
	const [dataChart, setDataChart] = useState<any[]>([]);

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
		// onSuccess(data) {
		// 	if (data) {
		// 		setUuidSpec(data[0]?.uuid);
		// 	}
		// },
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

	const listCriteria = useQuery([QUERY_KEY.dropdown_tieu_chi_quy_cach, uuidSpec, uuidQuality], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: criteriaServices.listCriteriaSpec({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					specificationUuid: uuidSpec,
					qualityUuid: uuidQuality,
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

	const dataBoardStatistics = useQuery(
		[
			QUERY_KEY.thong_ke_bieu_do_chat_luong,
			userOwnerUuid,
			uuidCompany,
			customerUuid,
			uuidStorage,
			listCompanyUuid,
			listPartnerUuid,
			provinceUuid,
			uuidSpec,
			uuidProduct,
			uuidQuality,
			userPartnerUuid,
			uuidCriteria,
			date,
		],
		{
			queryFn: () =>
				httpRequest({
					isData: true,
					http: batchBillServices.dashbroadSpecBillIn({
						companyUuid: uuidCompany,
						customerUuid: customerUuid,
						isShowBDMT: 0,
						partnerUuid: '',
						provinceId: provinceUuid,
						storageUuid: uuidStorage,
						timeStart: timeSubmit(date?.from)!,
						timeEnd: timeSubmit(date?.to, true)!,
						transportType: null,
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
			onSuccess({data}) {
				// Convert data chart
				const dataConvert = data?.lstInfoDaily?.map((v: any) => {
					const date =
						data?.typeShow == TYPE_DATE_SHOW.HOUR
							? moment(v?.timeScale).format('HH:mm')
							: data?.typeShow == TYPE_DATE_SHOW.DAY
							? moment(v?.timeScale).format('DD/MM')
							: data?.typeShow == TYPE_DATE_SHOW.MONTH
							? moment(v?.timeScale).format('MM-YYYY')
							: moment(v?.timeScale).format('YYYY');

					const objTotal = {
						'Trung bình': data?.percentAvg || 0,
					};

					const obj = v?.customerDateWeightUu?.reduce(
						(acc: any, {customerUu, percentAvg}: {customerUu: any; percentAvg: number}) => {
							acc[customerUu?.name] = percentAvg;
							return acc;
						},
						{}
					);

					return {
						name: date,
						...objTotal,
						...obj,
					};
				});

				const productColors = data?.lstInfoDaily
					?.flatMap((v: any) => {
						const colors = ['#2CAE39', '#8A2BE2', '#FF4500', '#32CD32', '#FFD700', '#00CED1', '#FF1493'];
						let colorIndex = 0;

						return [
							{
								key: 'Trung bình',
								fill: '#FF6838',
							},

							...v?.customerDateWeightUu.map((v: any) => ({
								key: v?.customerUu.name,
								fill: colors[colorIndex++ % colors.length],
							})),
						];
					})
					.reduce((acc: any, {key, fill}: {key: string; fill: string}) => {
						if (key && !acc[key]) {
							acc[key] = fill;
						}
						return acc;
					}, {});

				const productTypes = productColors
					? Object.entries(productColors).map(([key, fill]) => ({
							key,
							fill,
					  }))
					: [];

				setProductTypes(productTypes);
				setDataChart(dataConvert);
			},
		}
	);

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
		if (uuidQuality) {
			setUuidCriteria(listCriteria?.data?.[0]?.uuid || '');
		}
	}, [uuidSpec, uuidQuality]);

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

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ thống kê chất lượng</h3>
				<div className={styles.filter}>
					<SelectFilterMany
						selectedIds={listCompanyUuid}
						setSelectedIds={setListCompanyUuid}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Kv cảng xuất khẩu'
					/>
					<SelectFilterMany
						selectedIds={userPartnerUuid}
						setSelectedIds={setUserPartnerUuid}
						listData={listUserPurchasing?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						name='Quản lý nhập hàng'
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
						selectedIds={userOwnerUuid}
						setSelectedIds={setUserOwnerUuid}
						listData={listUserMarket?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						name='Quản lý nhân viên thị trường'
					/>
					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						isShowAll={false}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Nhà cung cấp'
					/>

					<SelectFilterMany
						selectedIds={provinceUuid}
						setSelectedIds={setProvinceUuid}
						listData={listProvince?.data?.map((v: any) => ({
							uuid: v?.matp,
							name: v?.name,
						}))}
						name='Tỉnh thành'
					/>
					<SelectFilterState
						isShowAll={false}
						uuid={uuidProduct}
						setUuid={setUuidProduct}
						listData={listProductType?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Loại hàng'
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
						uuid={uuidSpec}
						setUuid={setUuidSpec}
						listData={listSpecifications?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Quy cách'
					/>
					<SelectFilterState
						isShowAll={false}
						uuid={uuidCriteria}
						setUuid={setUuidCriteria}
						listData={listCriteria?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.title,
						}))}
						placeholder='Tiêu chí'
					/>

					<div className={styles.filter}>
						<SelectFilterDate
							isOptionDateAll={false}
							date={date}
							setDate={setDate}
							typeDate={typeDate}
							setTypeDate={setTypeDate}
						/>
					</div>
				</div>
			</div>
			<div className={styles.head_data}>
				{/* <p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2A85FF'}}></div>
						<div className={styles.circle} style={{borderColor: '#2A85FF'}}></div>
					</div>
					<div>
						Lớn nhất:<span>{convertCoin(dataBoardStatistics?.data?.data?.priceMax)} (VNĐ)</span>
					</div>
				</p> */}
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#FF6838'}}></div>
						<div className={styles.circle} style={{borderColor: '#FF6838'}}></div>
					</div>
					<div>
						Trung bình
						{/* :<span>{convertCoin(dataBoardStatistics?.data?.data?.priceAvg)} (VNĐ)</span> */}
					</div>
				</p>
				{/* <p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2DA2BC'}}></div>
						<div className={styles.circle} style={{borderColor: '#2DA2BC'}}></div>
					</div>
					<div>
						Nhỏ nhất:<span>{convertCoin(dataBoardStatistics?.data?.data?.priceMin)} (VNĐ)</span>
					</div>
				</p> */}
				{/* <p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2CAE39'}}></div>
						<div className={styles.circle} style={{borderColor: '#2CAE39'}}></div>
					</div>
					<div>
						Khách hàng:<span>{convertCoin(dataBoardStatistics
						?.data?.data?.overview?.customerLine)} (VNĐ)</span>
					</div>
				</p> */}
			</div>
			<div className={styles.main_chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<ComposedChart
						width={500}
						height={300}
						data={dataChart}
						margin={{
							top: 8,
							right: 8,
							left: 24,
							bottom: 8,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' scale='point' padding={{left: 40}} />
						<YAxis domain={[0, 1]} tickFormatter={(value) => convertCoin(value)} />
						<Tooltip formatter={(value) => convertCoin(Number(value))} />

						{productTypes
							.filter((v) => v.key !== 'Trung bình')
							.map((v, i) => (
								<Scatter
									key={i}
									dataKey={v.key}
									stroke='none'
									fill={v?.fill}
									// dot={{r: 4, fill: '#fff', stroke: v.fill, strokeWidth: 2}}
								/>
							))}

						{productTypes
							.filter((v) => v.key === 'Trung bình')
							.map((v, i) => (
								<Line key={`line-${i}`} dataKey={'Trung bình'} stroke={v.fill} fill={v?.fill} />
							))}
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartStackStatisticsByDay;
