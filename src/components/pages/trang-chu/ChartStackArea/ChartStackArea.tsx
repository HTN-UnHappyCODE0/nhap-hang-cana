import React, {useEffect, useMemo, useState} from 'react';

import {PropsChartStackArea} from './interfaces';
import styles from './ChartStackArea.module.scss';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import SelectFilterOption from '../SelectFilterOption';
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
import priceTagServices from '~/services/priceTagServices';
import SelectFilterDate from '../SelectFilterDate';
import {timeSubmit} from '~/common/funcs/optionConvert';
import companyServices from '~/services/companyServices';
import moment from 'moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import wareServices from '~/services/wareServices';
import commonServices from '~/services/commonServices';
import SelectFilterMany from '../SelectFilterMany';
import partnerServices from '~/services/partnerServices';

function ChartStackArea({}: PropsChartStackArea) {
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [productUuid, setProductUuid] = useState<string>('');
	const [userUuid, setUserUuid] = useState<string>('');
	const [uuidCompany, setUuidCompanyFilter] = useState<string[]>([]);
	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.THIS_YEAR);
	const [provinceUuid, setProvinceUuid] = useState<string[]>([]);
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);
	const [dataChart, setDataChart] = useState<any[]>([]);
	const [productTypes, setProductTypes] = useState<any[]>([]);
	const [listPartnerUuid, setListPartnerUuid] = useState<any[]>([]);
	const [uuidQuality, setUuidQuality] = useState<string>('');

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang_nhap, uuidCompany, listPartnerUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					partnerUUid: '',
					userUuid: '',
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					provinceId: '',
					specUuid: '',
					listCompanyUuid: uuidCompany,
					listPartnerUUid: listPartnerUuid,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap, uuidCompany, userUuid], {
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
					userUuid: userUuid,
					provinceId: '',
					type: TYPE_PARTNER.NCC,
					listCompanyUuid: uuidCompany,
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
	const listUser = useQuery([QUERY_KEY.dropdown_nguoi_quan_ly], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuid: listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])
						? listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid
						: null,
					regencyUuidExclude: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const dataBoardDailyPrice = useQuery(
		[
			QUERY_KEY.thong_ke_bieu_do_gia_tien_theo_ngay,
			productUuid,
			customerUuid,
			date,
			userUuid,
			uuidCompany,
			listPartnerUuid,
			provinceUuid,
			uuidQuality,
		],
		{
			queryFn: () =>
				httpRequest({
					isData: true,
					http: priceTagServices.dashBoardDailyPrice({
						timeStart: timeSubmit(date?.from)!,
						timeEnd: timeSubmit(date?.to, true)!,
						userOwnerUuid: userUuid,
						transportType: null,
						productTypeUuid: productUuid,
						customerUuid: customerUuid,
						listCompanyUuid: uuidCompany,
						listPartnerUuid: listPartnerUuid,
						provinceId: provinceUuid,
						qualityUUid: uuidQuality,
					}),
				}),
			onSuccess({data}) {
				// Convert data chart
				const dataConvert = data?.lstPriceDay?.map((v: any) => {
					const date =
						data?.typeShow == TYPE_DATE_SHOW.HOUR
							? moment(v?.daily).format('HH:mm')
							: data?.typeShow == TYPE_DATE_SHOW.DAY
							? moment(v?.daily).format('DD/MM')
							: data?.typeShow == TYPE_DATE_SHOW.MONTH
							? moment(v?.daily).format('MM-YYYY')
							: moment(v?.daily).format('YYYY');

					const objTotal = {
						'Lớn nhất': v?.priceMax || 0,
						'Trung bình': v?.priceAvg || 0,
						'Nhỏ nhất': v?.priceMin || 0,
					};

					const obj = v?.customerPriceDTO?.reduce((acc: any, {customerUu, price}: {customerUu: any; price: number}) => {
						acc[customerUu?.name] = price;
						return acc;
					}, {});

					return {
						name: date,
						...objTotal,
						...obj,
					};
				});

				// Convert bar chart
				// const productColors = data?.chart
				// 	?.flatMap((item: any) =>
				// 		item.productDateWeightUu.map((product: any) => ({
				// 			name: product.productTypeUu.name,
				// 			color: product.productTypeUu.colorShow,
				// 		}))
				// 	)
				// 	.reduce((acc: any, {name, color}: {name: string; color: string}) => {
				// 		if (!acc[name]) {
				// 			acc[name] = color;
				// 		}
				// 		return acc;
				// 	}, {});

				const productColors = data?.lstPriceDay
					?.flatMap((v: any) => {
						const colors = ['#2CAE39', '#8A2BE2', '#FF4500', '#32CD32', '#FFD700', '#00CED1', '#FF1493'];
						let colorIndex = 0;

						return [
							{
								key: 'Lớn nhất',
								fill: '#2A85FF',
							},
							{
								key: 'Trung bình',
								fill: '#FF6838',
							},
							{
								key: 'Nhỏ nhất',
								fill: '#2DA2BC',
							},

							...v?.customerPriceDTO.map((v: any) => ({
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
				// setDataTotal({
				// 	totalWeight: data?.totalWeight,
				// 	lstProductTotal: data?.lstProductTotal?.map((v: any) => ({
				// 		name: v?.productTypeUu?.name,
				// 		colorShow: v?.productTypeUu?.colorShow,
				// 		weightMT: v?.weightMT,
				// 	})),
				// });
			},
		}
	);

	const filteredProductTypes = useMemo(() => {
		if (customerUuid?.length === 0) {
			return productTypes.filter((v) => v.key !== 'Khách hàng');
		}
		return productTypes;
	}, [customerUuid, productTypes]);

	const filteredDataChart = useMemo(() => {
		if (customerUuid?.length === 0) {
			return dataChart?.map((item) => {
				const {'Khách hàng': _, ...rest} = item;
				return rest;
			});
		}
		return dataChart;
	}, [customerUuid, dataChart]);

	useEffect(() => {
		if (uuidCompany) {
			setCustomerUuid([]);
		}
		if (listPartnerUuid) {
			setCustomerUuid([]);
		}
	}, [uuidCompany, listPartnerUuid]);

	useEffect(() => {
		if (uuidCompany) {
			setListPartnerUuid([]);
		}
	}, [uuidCompany]);

	useEffect(() => {
		if (listProductType?.data?.length > 0) {
			setProductUuid(listProductType.data[listProductType.data.length - 1].uuid);
		}
	}, [listProductType.data]);

	useEffect(() => {
		if (userUuid) {
			setListPartnerUuid([]);
		}
	}, [userUuid]);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ giá tiền nhập hàng (VNĐ)</h3>
				<div className={styles.filter}>
					<SelectFilterMany
						selectedIds={uuidCompany}
						setSelectedIds={setUuidCompanyFilter}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả kv cảng xuất khẩu'
					/>
					<CheckRegencyCode
						isPage={false}
						regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG]}
					>
						<SelectFilterOption
							uuid={userUuid}
							setUuid={setUserUuid}
							listData={listUser?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.fullName,
							}))}
							placeholder='Tất cả người quản lý công ty'
						/>
					</CheckRegencyCode>
					<SelectFilterMany
						selectedIds={listPartnerUuid}
						setSelectedIds={setListPartnerUuid}
						listData={listPartner?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Công ty'
					/>

					<SelectFilterMany
						isShowAll={false}
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Chọn nhà cung cấp'
					/>
					<SelectFilterOption
						isShowAll={false}
						uuid={productUuid}
						setUuid={setProductUuid}
						listData={listProductType?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả loại hàng'
					/>
					<SelectFilterDate isOptionDateAll={false} date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />

					<SelectFilterMany
						selectedIds={provinceUuid}
						setSelectedIds={setProvinceUuid}
						listData={listProvince?.data?.map((v: any) => ({
							uuid: v?.matp,
							name: v?.name,
						}))}
						placeholder='Tất cả tỉnh thành'
					/>
					<SelectFilterOption
						uuid={uuidQuality}
						setUuid={setUuidQuality}
						listData={listQuality?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả quốc gia'
					/>
				</div>
			</div>
			<div className={styles.head_data}>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2A85FF'}}></div>
						<div className={styles.circle} style={{borderColor: '#2A85FF'}}></div>
					</div>
					<div>
						Lớn nhất:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.priceMax)} (VNĐ)</span>
					</div>
				</p>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#FF6838'}}></div>
						<div className={styles.circle} style={{borderColor: '#FF6838'}}></div>
					</div>
					<div>
						Trung bình:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.priceAvg)} (VNĐ)</span>
					</div>
				</p>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2DA2BC'}}></div>
						<div className={styles.circle} style={{borderColor: '#2DA2BC'}}></div>
					</div>
					<div>
						Nhỏ nhất:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.priceMin)} (VNĐ)</span>
					</div>
				</p>
				{/* <p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2CAE39'}}></div>
						<div className={styles.circle} style={{borderColor: '#2CAE39'}}></div>
					</div>
					<div>
						Khách hàng:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.overview?.customerLine)} (VNĐ)</span>
					</div>
				</p> */}
			</div>
			<div className={styles.main_chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<AreaChart
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
						<YAxis domain={[2000000, 'dataMax']} tickFormatter={(value) => convertCoin(value)} />
						<Tooltip formatter={(value) => convertCoin(Number(value))} />

						{productTypes.map((v) => (
							<Area
								key={v.key}
								type='linear'
								dataKey={v.key}
								stroke={v.fill}
								fill='none'
								dot={{r: 4, fill: '#fff', stroke: v.fill, strokeWidth: 2}}
							/>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartStackArea;
