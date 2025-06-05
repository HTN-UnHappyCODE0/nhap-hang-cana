import React, {useState} from 'react';
import {ITypeUu, PropsChartImportCompany} from './interfaces';
import styles from './ChartImportCompany.module.scss';
import {Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area, Line} from 'recharts';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_DATE_SHOW,
	TYPE_PRODUCT,
	TYPE_SHOW_BDMT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import batchBillServices from '~/services/batchBillServices';
import moment from 'moment';
import {convertWeight, timeSubmit} from '~/common/funcs/optionConvert';
import storageServices from '~/services/storageServices';
import SelectFilterState from '~/components/common/SelectFilterState';
import {usePageHomeContext} from '../context';

function ChartImportCompany({}: PropsChartImportCompany) {
	const [isShowBDMT, setIsShowBDMT] = useState<string>(String(TYPE_SHOW_BDMT.MT));
	const [isProductSpec, setIsProductSpec] = useState<string>('1');
	const [isTransport, setIsTransport] = useState<string>('');
	const [storageUuid, setStorageUuid] = useState<string>('');
	const [productUuid, setProductUuid] = useState<string>('');
	const [specUuid, setSpecUuid] = useState<string>('');
	const [dataChartMT, setDataChartMT] = useState<any[]>([]);
	const [dataChartBDMT, setDataChartBDMT] = useState<any[]>([]);
	const [productTypes, setProductTypes] = useState<any[]>([]);
	const [listProductType, setListProductType] = useState<ITypeUu[]>([]);
	const [listSpecType, setListSpecType] = useState<ITypeUu[]>([]);
	const [dataTotal, setDataTotal] = useState<{
		totalWeight: number;
		totalWeightBDMT: number;
		weightBDMTAvg: number;
		weightMTAvg: number;
		drynessAvg: number;
		lstProductTotal: {
			name: string;
			colorShow: string;
			weightMT: number;
			weightBDMT: number;
			drynessAvg: number;
		}[];
	}>({
		totalWeightBDMT: 0,
		drynessAvg: 0,
		totalWeight: 0,
		weightMTAvg: 0,
		weightBDMTAvg: 0,
		lstProductTotal: [],
	});

	const {date, provinceUuid, listCompanyUuid, listUserPurchasingUuid, listPartnerUuid, listUserOwnerUuid, listCustomerUuid} =
		usePageHomeContext();

	const listStorage = useQuery([QUERY_KEY.dropdown_bai], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					warehouseUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

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
	// 	select(data) {
	// 		return data;
	// 	},
	// });

	useQuery(
		[
			QUERY_KEY.thong_ke_tong_hang_nhap,
			listCustomerUuid,
			storageUuid,
			date,
			listUserOwnerUuid,
			listCompanyUuid,
			isProductSpec,
			provinceUuid,
			isTransport,
			listUserPurchasingUuid,
			listPartnerUuid,
			productUuid,
			specUuid,
		],
		{
			queryFn: () =>
				httpRequest({
					isData: true,
					http: batchBillServices.dashbroadBillIn({
						partnerUuid: '',
						customerUuid: listCustomerUuid,
						isShowBDMT: 1,
						storageUuid: storageUuid,
						userOwnerUuid: listUserOwnerUuid,
						userPartnerUuid: listUserPurchasingUuid,
						warehouseUuid: '',
						companyUuid: '',
						typeFindDay: 0,
						timeStart: timeSubmit(date?.from)!,
						timeEnd: timeSubmit(date?.to, true)!,
						provinceId: provinceUuid,
						transportType: isTransport ? Number(isTransport) : null,
						listCompanyUuid: listCompanyUuid,
						listPartnerUuid: listPartnerUuid,
					}),
				}),
			onSuccess({data}) {
				const dataProductType = data?.lstProductDay
					?.flatMap(
						(item: any) =>
							item['productDateWeightUu'].map((product: any) => ({
								uuid: product.productTypeUu.uuid,
								name: product.productTypeUu.name,
							})) || []
					)
					.reduce((acc: any[], current: any) => {
						const exists = acc.find((item) => item.uuid === current.uuid);
						if (!exists) acc.push(current);
						return acc;
					}, []);

				const dataSpecType = data?.lstProductDay
					?.flatMap(
						(item: any) =>
							item['specDateWeightUu'].map((product: any) => ({
								uuid: product.productTypeUu.uuid,
								name: product.productTypeUu.name,
							})) || []
					)
					.reduce((acc: any[], current: any) => {
						const exists = acc.find((item) => item.uuid === current.uuid);
						if (!exists) acc.push(current);
						return acc;
					}, []);

				// Convert data chart
				const dataConvertMT = data?.lstProductDay?.map((v: any) => {
					const date =
						data?.typeShow == TYPE_DATE_SHOW.HOUR
							? moment(v?.timeScale).format('HH:mm')
							: data?.typeShow == TYPE_DATE_SHOW.DAY
							? moment(v?.timeScale).format('DD/MM')
							: data?.typeShow == TYPE_DATE_SHOW.MONTH
							? moment(v?.timeScale).format('MM-YYYY')
							: moment(v?.timeScale).format('YYYY');

					const sourceArr = v?.[isProductSpec === '2' ? 'specDateWeightUu' : 'productDateWeightUu'] || [];

					const filteredArr =
						isProductSpec === '1' && productUuid
							? sourceArr.filter((item: any) => item.productTypeUu.uuid === productUuid)
							: isProductSpec === '2' && specUuid
							? sourceArr.filter((item: any) => item.productTypeUu.uuid === specUuid)
							: sourceArr;

					const obj = filteredArr.reduce((acc: any, item: any) => {
						acc[item.productTypeUu.name] = item.weightMT;
						acc[`${item.productTypeUu.name}_drynessAvg`] = item.drynessAvg || 50;
						acc[`${item.productTypeUu.name}_weightAvg`] = data?.weightMTAvg;
						return acc;
					}, {});

					const objTotal = {
						'Trung bình': data?.weightMTAvg || 0,
					};

					return {
						name: date,
						...objTotal,
						...obj,
					};
				});

				const dataConvertBDMT = data?.lstProductDay?.map((v: any) => {
					const date =
						data?.typeShow == TYPE_DATE_SHOW.HOUR
							? moment(v?.timeScale).format('HH:mm')
							: data?.typeShow == TYPE_DATE_SHOW.DAY
							? moment(v?.timeScale).format('DD/MM')
							: data?.typeShow == TYPE_DATE_SHOW.MONTH
							? moment(v?.timeScale).format('MM-YYYY')
							: moment(v?.timeScale).format('YYYY');

					const sourceArr = v?.[isProductSpec === '2' ? 'specDateWeightUu' : 'productDateWeightUu'] || [];

					const filteredArr =
						isProductSpec === '1' && productUuid
							? sourceArr.filter((item: any) => item.productTypeUu.uuid === productUuid)
							: isProductSpec === '2' && specUuid
							? sourceArr.filter((item: any) => item.productTypeUu.uuid === specUuid)
							: sourceArr;

					const obj = filteredArr.reduce((acc: any, item: any) => {
						acc[item.productTypeUu.name] = item.weightBDMT;
						acc[`${item.productTypeUu.name}_drynessAvg`] = item.drynessAvg || 50;
						acc[`${item.productTypeUu.name}_weightAvg`] = data?.weightBDMTAvg;
						return acc;
					}, {});

					const objTotal = {
						'Trung bình': data?.weightBDMTAvg || 0,
					};

					return {
						name: date,
						...objTotal,
						...obj,
					};
				});

				// Convert bar chart
				const productColors = data?.lstProductDay
					?.flatMap((item: any) =>
						item[isProductSpec === '2' ? 'specDateWeightUu' : 'productDateWeightUu'].map((product: any) => ({
							name: product.productTypeUu.name,
							color: product.productTypeUu.colorShow,
						}))
					)
					.reduce((acc: any, {name, color}: {name: string; color: string}) => {
						if (!acc[name]) {
							acc[name] = color;
						}
						return acc;
					}, {});

				const productTypes = [
					...Object.keys(productColors).map((key) => ({
						key,
						fill: productColors[key],
					})),
					{
						key: 'Trung bình',
						fill: '#FF8C00',
					},
				];

				setListProductType(dataProductType);
				setDataChartMT(dataConvertMT);
				setDataChartBDMT(dataConvertBDMT);
				setProductTypes(productTypes);
				setListSpecType(dataSpecType);

				const totalWeight =
					isProductSpec === '2' && specUuid
						? data?.lstSpecTotal?.find((item: any) => item.productTypeUu?.uuid === specUuid)?.weightMT || 0
						: isProductSpec === '1' && productUuid
						? data?.lstProductTotal?.find((item: any) => item.productTypeUu?.uuid === productUuid)?.weightMT || 0
						: data?.totalWeight || 0;
				const totalWeightBDMT =
					isProductSpec === '2' && specUuid
						? data?.lstSpecTotal?.find((item: any) => item.productTypeUu?.uuid === specUuid)?.weightBDMT || 0
						: isProductSpec === '1' && productUuid
						? data?.lstProductTotal?.find((item: any) => item.productTypeUu?.uuid === productUuid)?.weightBDMT || 0
						: data?.totalWeightBDMT || 0;
				const drynessAvg =
					isProductSpec === '2' && specUuid
						? data?.lstSpecTotal?.find((item: any) => item.productTypeUu?.uuid === specUuid)?.drynessAvg || 0
						: isProductSpec === '1' && productUuid
						? data?.lstProductTotal?.find((item: any) => item.productTypeUu?.uuid === productUuid)?.drynessAvg || 0
						: data?.drynessAvg || 0;

				setDataTotal({
					totalWeight: totalWeight,
					totalWeightBDMT: totalWeightBDMT,
					weightBDMTAvg: data?.weightBDMTAvg,
					weightMTAvg: data?.weightMTAvg,
					drynessAvg: drynessAvg,
					lstProductTotal: (isProductSpec === '2' ? data?.lstSpecTotal : data?.lstProductTotal)?.map((v: any) => ({
						name: v?.productTypeUu?.name,
						colorShow: v?.productTypeUu?.colorShow,
						weightMT: v?.weightMT,
						weightBDMT: v?.weightBDMT,
						drynessAvg: v?.drynessAvg,
					})),
				});
			},
			enabled: !!date?.from && !!date?.to,
		}
	);

	const currentData = isShowBDMT === String(TYPE_SHOW_BDMT.MT) ? dataChartMT : dataChartBDMT;

	const drynessValues = currentData.flatMap((item) => productTypes.map((v) => item[`${v.key}_drynessAvg`] || 50));
	const minDryness = Math.min(...drynessValues) - 1;
	const maxDryness = Math.max(...drynessValues) + 1;

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ thống kê hàng nhập</h3>
				<div className={styles.filter}>
					<SelectFilterState
						isShowAll={false}
						uuid={isShowBDMT}
						setUuid={setIsShowBDMT}
						listData={[
							{
								uuid: String(TYPE_SHOW_BDMT.MT),
								name: 'Tấn tươi',
							},
							{
								uuid: String(TYPE_SHOW_BDMT.BDMT),
								name: 'Tấn khô',
							},
						]}
						placeholder='Xem theo'
					/>
					<SelectFilterState
						isShowAll={false}
						uuid={isProductSpec}
						setUuid={setIsProductSpec}
						listData={[
							{
								uuid: String(1),
								name: 'Loại hàng',
							},
							{
								uuid: String(2),
								name: 'Quy cách',
							},
						]}
						placeholder='Kiểu'
					/>

					{isProductSpec == '1' && (
						<SelectFilterState
							uuid={productUuid}
							setUuid={setProductUuid}
							listData={listProductType?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Loại hàng'
						/>
					)}
					{isProductSpec == '2' && (
						<SelectFilterState
							uuid={specUuid}
							setUuid={setSpecUuid}
							listData={listSpecType?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Quy cách'
						/>
					)}

					{/* <SelectFilterState
						uuid={uuidCompany}
						setUuid={setUuidCompanyFilter}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả kv cảng xuất khẩu'
					/> */}
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
					<CheckRegencyCode
						isPage={false}
						regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG]}
					>
						<SelectFilterMany
							selectedIds={userUuid}
							setSelectedIds={setUserUuid}
							listData={listUserMarket?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.fullName,
							}))}
							name='NVTT'
						/>
					</CheckRegencyCode>
					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='NCC'
					/> */}
					<SelectFilterState
						uuid={storageUuid}
						setUuid={setStorageUuid}
						listData={listStorage?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Bãi'
					/>
					{/* <SelectFilterDate isOptionDateAll={false} date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} /> */}

					<SelectFilterState
						// isShowAll={true}
						uuid={isTransport}
						setUuid={setIsTransport}
						listData={[
							{
								uuid: String(TYPE_TRANSPORT.DUONG_BO),
								name: 'Đường bộ',
							},
							{
								uuid: String(TYPE_TRANSPORT.DUONG_THUY),
								name: 'Đường thủy',
							},
						]}
						placeholder='Vận chuyển'
					/>
				</div>
			</div>
			<div className={styles.head_data}>
				<p className={styles.data_total}>
					Tổng khối lượng nhập hàng:{' '}
					<span>
						{isShowBDMT === String(TYPE_SHOW_BDMT.MT)
							? convertWeight(dataTotal?.totalWeight)
							: convertWeight(dataTotal?.totalWeightBDMT)}
						<span> ({dataTotal?.drynessAvg?.toFixed(2)}%)</span>
					</span>
				</p>
				{((isProductSpec === '2' && !specUuid) || (isProductSpec === '1' && !productUuid)) && (
					<p className={styles.data_total}>
						Khối lượng trung bình:{' '}
						<span>
							{isShowBDMT === String(TYPE_SHOW_BDMT.MT)
								? convertWeight(dataTotal?.weightMTAvg)
								: convertWeight(dataTotal?.weightBDMTAvg)}
							{/* <span> ({dataTotal?.drynessAvg?.toFixed(2)}%)</span> */}
						</span>
					</p>
				)}

				{((isProductSpec === '2' && !specUuid) || (isProductSpec === '1' && !productUuid)) && (
					<>
						{dataTotal?.lstProductTotal?.map((v, i) => (
							<div key={i} className={styles.data_item}>
								<div style={{background: v?.colorShow}} className={styles.box_color}></div>
								<p className={styles.data_total}>
									{v?.name}:{' '}
									<span style={{color: '#171832'}}>
										{isShowBDMT === String(TYPE_SHOW_BDMT.MT)
											? convertWeight(v?.weightMT)
											: convertWeight(v?.weightBDMT)}
										<span> ({v?.drynessAvg?.toFixed(2)}%)</span>
									</span>
								</p>
							</div>
						))}
					</>
				)}
			</div>
			<div className={styles.main_chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<ComposedChart
						width={500}
						height={300}
						data={isShowBDMT === String(TYPE_SHOW_BDMT.MT) ? dataChartMT : dataChartBDMT}
						margin={{
							top: 8,
							right: 8,
							left: 24,
							bottom: 8,
						}}
						barSize={24}
					>
						<XAxis dataKey='name' scale='point' padding={{left: 40, right: 10}} />

						<YAxis domain={[0, 4000000]} tickFormatter={(value): any => convertWeight(value)} />

						{/* <YAxis yAxisId='right' domain={[minDryness, maxDryness]} orientation='right' tickFormatter={(v) => `${v}%`} /> */}

						<Tooltip
							formatter={(value, name, props): any => {
								const dryness = props?.payload?.[`${name}_drynessAvg`] ?? 0;
								return [`${convertWeight(Number(value))} (${dryness?.toFixed(2)}%)`, name];
							}}
						/>

						<CartesianGrid strokeDasharray='3 3' vertical={false} />

						{productTypes
							.filter((v) => v.key !== 'Trung bình')
							.map((v, i) => (
								<Bar key={i} dataKey={v?.key} stackId='product_type' fill={v?.fill} />
							))}

						{((isProductSpec === '2' && !specUuid) || (isProductSpec === '1' && !productUuid)) &&
							productTypes
								.filter((v) => v.key === 'Trung bình')
								.map((v, i) => <Line key={`line-${i}`} dataKey='Trung bình' stroke={v?.fill} fill={v?.fill} />)}

						{/* {productTypes.map((v, i) => (
							<Line
								key={`line-${i}`}
								tooltipType='none'
								dataKey={`Trung bình`}
								stroke={v?.fill}
								fill={v?.fill}
								// yAxisId='right'
							/>
						))} */}
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartImportCompany;
