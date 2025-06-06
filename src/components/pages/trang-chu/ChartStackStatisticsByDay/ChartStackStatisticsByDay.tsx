import React, {useEffect, useState} from 'react';

import {PropsChartStackStatisticsByDay} from './interfaces';
import styles from './ChartStackStatisticsByDay.module.scss';
import {XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Scatter} from 'recharts';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_DATE_SHOW,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import {timeSubmit} from '~/common/funcs/optionConvert';
import moment from 'moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import wareServices from '~/services/wareServices';
import batchBillServices from '~/services/batchBillServices';
import criteriaServices from '~/services/criteriaServices';
import SelectFilterState from '~/components/common/SelectFilterState';
import {usePageHomeContext} from '../context';

function ChartStackStatisticsByDay({}: PropsChartStackStatisticsByDay) {
	const [listStatisticsByDay, setListStatisticsByDay] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uuidQuality, setUuidQuality] = useState<string>('');
	const [uuidStorage, setUuidStorage] = useState<string>('');
	const [uuidSpec, setUuidSpec] = useState<string>('');
	const [uuidCriteria, setUuidCriteria] = useState<string>('');
	const [productTypes, setProductTypes] = useState<any[]>([]);
	const [dataChart, setDataChart] = useState<any[]>([]);

	const {date, provinceUuid, listCompanyUuid, listUserPurchasingUuid, listPartnerUuid, listUserOwnerUuid, listCustomerUuid, productUuid} =
		usePageHomeContext();

	// const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
	// 	queryFn: () =>
	// 		httpRequest({
	// 			isDropdown: true,
	// 			http: wareServices.listProductType({
	// 				page: 1,
	// 				pageSize: 50,
	// 				keyword: '',
	// 				status: CONFIG_STATUS.HOAT_DONG,
	// 				isPaging: CONFIG_PAGING.NO_PAGING,
	// 				isDescending: CONFIG_DESCENDING.NO_DESCENDING,
	// 				typeFind: CONFIG_TYPE_FIND.DROPDOWN,
	// 				type: [TYPE_PRODUCT.CONG_TY],
	// 			}),
	// 		}),
	// 	onSuccess(data) {
	// 		if (data) {
	// 			setUuidProduct(data[0]?.uuid);
	// 		}
	// 	},
	// 	select(data) {
	// 		return data;
	// 	},
	// });

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

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach, productUuid, uuidQuality], {
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
					productTypeUuid: productUuid,
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
			listUserOwnerUuid,
			listCustomerUuid,
			uuidStorage,
			listCompanyUuid,
			listPartnerUuid,
			provinceUuid,
			uuidSpec,
			productUuid,
			uuidQuality,
			listUserPurchasingUuid,
			uuidCriteria,
			date,
		],
		{
			queryFn: () =>
				httpRequest({
					isData: true,
					http: batchBillServices.dashbroadSpecBillIn({
						companyUuid: '',
						customerUuid: listCustomerUuid,
						isShowBDMT: 0,
						partnerUuid: '',
						provinceId: provinceUuid,
						storageUuid: uuidStorage,
						timeStart: timeSubmit(date?.from)!,
						timeEnd: timeSubmit(date?.to, true)!,
						transportType: null,
						typeFindDay: 0,
						typeShow: 0,
						userOwnerUuid: listUserOwnerUuid,
						userPartnerUuid: listUserPurchasingUuid,
						warehouseUuid: '',
						listCompanyUuid: listCompanyUuid,
						listPartnerUuid: listPartnerUuid,
						specificationUuid: uuidSpec,
						productTypeUuid: productUuid,
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

					const objDay = {
						['Theo thời gian']: v?.percentAvg || 0,
					};

					return {
						name: date,
						...objDay,
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

							{
								key: 'Theo thời gian',
								fill: '#2A85FF',
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
			enabled: !!date?.from && !!date?.to,
		}
	);

	console.log('dataChart', dataChart);

	useEffect(() => {
		if (productUuid) {
			setUuidSpec(listSpecifications?.data?.[0]?.uuid || '');
		}
		if (uuidQuality) {
			setUuidSpec(listSpecifications?.data?.[0]?.uuid || '');
		}
	}, [productUuid, uuidQuality]);

	useEffect(() => {
		if (uuidSpec) {
			setUuidCriteria(listCriteria?.data?.[0]?.uuid || '');
		}
		if (uuidQuality) {
			setUuidCriteria(listCriteria?.data?.[0]?.uuid || '');
		}
	}, [uuidSpec, uuidQuality]);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ thống kê chất lượng</h3>
				<div className={styles.filter}>
					{/* <SelectFilterManyOption
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
						name='NVTT'
					/>
					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						isShowAll={false}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='NCC'
					/> */}

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
							.filter((v) => v.key !== 'Trung bình' && v.key !== 'Theo thời gian')
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
							.filter((v) => v.key === 'Theo thời gian')
							.map((v, i) => (
								<Scatter
									key={`percentDay-${i}`}
									dataKey={'Theo thời gian'}
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
