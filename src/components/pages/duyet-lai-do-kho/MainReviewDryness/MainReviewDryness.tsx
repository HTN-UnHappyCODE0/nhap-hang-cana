import React, {useEffect, useState} from 'react';

import {IReviewDryness, PropsMainReviewDryness} from './interfaces';
import styles from './MainReviewDryness.module.scss';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import FilterCustom from '~/components/common/FilterCustom';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CONFIRM,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import TippyHeadless from '@tippyjs/react/headless';
import Moment from 'react-moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import IconCustom from '~/components/common/IconCustom';
import {CloseCircle, TickCircle} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import batchBillServices from '~/services/batchBillServices';
import fixDrynessServices from '~/services/fixDrynessServices';
import Popup from '~/components/common/Popup';
import PopupRemoveDryness from '../PopupRemoveDryness';
import PopupConfirmDryness from '../PopupConfirmDryness';
import StateActive from '~/components/common/StateActive';

function MainReviewDryness({}: PropsMainReviewDryness) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_page, _pageSize, _keyword, _status, _customerUuid} = router.query;

	const [dataSpec, setDataSpec] = useState<any | null>(null);
	const [uuidDescription, setUuidDescription] = useState<string>('');
	const [total, setTotal] = useState<number>(0);
	const [listSelectBillRemove, setListSelectBillRemove] = useState<any[]>([]);
	const [listSelectBillConfirm, setListSelectBillConfirm] = useState<any[]>([]);
	const [listFixDryness, setListFixDryness] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uuidConfirm, setUuidConfirm] = useState<any[]>([]);
	const [uuidReject, setUuidReject] = useState<any[]>([]);

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang], {
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
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_hang], {
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

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 50,
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

	useQuery([QUERY_KEY.table_do_kho_doi_duyet, _page, _pageSize, _status, _keyword, _customerUuid], {
		queryFn: () =>
			httpRequest({
				isList: true,
				setLoading: setLoading,
				http: fixDrynessServices.getListFixDryness({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: !!_status ? Number(_status) : null,
					billUuid: '',
					customerUuid: _customerUuid ? (_customerUuid as string) : '',
					// billUuid: '',
					// codeEnd: null,
					// codeStart: null,
					// isBatch: !!_isBatch ? Number(_isBatch) : null,
					// scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP],
					// specUuid: !!_specUuid ? (_specUuid as string) : null,

					// storageUuid: '',
					// truckPlate: '',
					// timeStart: _dateFrom ? (_dateFrom as string) : null,
					// timeEnd: _dateTo ? (_dateTo as string) : null,
					// customerUuid: _customerUuid ? (_customerUuid as string) : '',
					// productTypeUuid: _productTypeUuid ? (_productTypeUuid as string) : '',
					// shift: !!_isShift ? Number(_isShift) : null,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setListFixDryness(
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
			if (data) {
				return data;
			}
		},
	});

	// const funcConfirm = useMutation({
	// 	mutationFn: () =>
	// 		httpRequest({
	// 			showMessageFailed: true,
	// 			showMessageSuccess: true,
	// 			msgSuccess: 'Xác nhận duyệt thành công!',
	// 			http: fixDrynessServices.acceptFixDryness({
	// 				uuid: uuidConfirm,
	// 				description: '',
	// 			}),
	// 		}),
	// 	onSuccess(data) {
	// 		if (data) {
	// 			setUuidConfirm([]);
	// 			queryClient.invalidateQueries([QUERY_KEY.table_do_kho_doi_duyet]);
	// 		}
	// 	},
	// 	onError(error) {
	// 		console.log({error});
	// 	},
	// });

	// const funcReject = useMutation({
	// 	mutationFn: () =>
	// 		httpRequest({
	// 			showMessageFailed: true,
	// 			showMessageSuccess: true,
	// 			msgSuccess: 'Từ chối duyệt thành công!',
	// 			http: batchBillServices.QLKConfirmBatchbill({
	// 				uuid: [],
	// 			}),
	// 		}),
	// 	onSuccess(data) {
	// 		if (data) {
	// 			setUuidReject([]);
	// 			queryClient.invalidateQueries([QUERY_KEY.table_do_kho_doi_duyet]);
	// 		}
	// 	},
	// 	onError(error) {
	// 		console.log({error});
	// 	},
	// });

	useEffect(() => {
		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					_status: STATUS_CONFIRM.DANG_DOI,
				},
			},
			undefined,
			{shallow: true, scroll: false}
		);
	}, [_status]);

	return (
		<div className={styles.container}>
			{/* <Loading loading={.isLoading} /> */}
			<div className={styles.header}>
				<div className={styles.main_search}>
					{listFixDryness?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								danger
								p_4_12
								onClick={() => {
									setListSelectBillRemove(listFixDryness?.filter((v) => v.isChecked !== false)?.map((x: any) => x.uuid));
								}}
							>
								Từ chối duyệt
							</Button>
						</div>
					)}
					{listFixDryness?.some((x) => x.isChecked !== false) && (
						<div style={{height: 40}}>
							<Button
								className={styles.btn}
								rounded_2
								maxHeight
								green
								p_4_12
								onClick={() => {
									setListSelectBillConfirm(listFixDryness?.filter((v) => v.isChecked !== false)?.map((x: any) => x.uuid));
								}}
							>
								Xác nhận duyệt
							</Button>
						</div>
					)}
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo số phiếu và mã lô hàng' />
					</div>
					{/* <div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Kiểu cân'
							query='_isBatch'
							listFilter={[
								{
									id: TYPE_BATCH.CAN_LO,
									name: 'Cân lô',
								},
								{
									id: TYPE_BATCH.CAN_LE,
									name: 'Cân lẻ',
								},
							]}
						/>
					</div> */}
					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_status'
							listFilter={[
								{
									id: STATUS_CONFIRM.DA_HUY,
									name: 'Đã từ chối',
								},
								{
									id: STATUS_CONFIRM.DANG_DOI,
									name: 'Đang chờ duyệt',
								},
								{
									id: STATUS_CONFIRM.DA_CHOT,
									name: 'Đã duyệt',
								},
							]}
						/>
					</div>
					<FilterCustom
						isSearch
						name='Khách hàng'
						query='_customerUuid'
						listFilter={listCustomer?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/>
					{/* <FilterCustom
						isSearch
						name='Loại hàng'
						query='_productTypeUuid'
						listFilter={listProductType?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/> */}
					{/* <FilterCustom
						isSearch
						name='Quy cách'
						query='_specUuid'
						listFilter={listSpecification?.data?.map((v: any) => ({
							id: v?.uuid,
							name: v?.name,
						}))}
					/> */}

					{/* <div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.TODAY} />
					</div> */}
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listFixDryness || []}
					loading={loading}
					noti={<Noti des='Hiện tại chưa có danh sách nhập liệu nào!' disableButton />}
				>
					<Table
						data={listFixDryness || []}
						onSetData={setListFixDryness}
						column={[
							{
								title: 'STT',
								checkBox: true,
								render: (data: IReviewDryness, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã lô',
								fixedLeft: true,
								render: (data: IReviewDryness) => (
									// <Link href={`#`} className={styles.link}>
									<p className={styles.link}>{data?.billUu?.code}</p>
									// </Link>
								),
							},
							// {
							// 	title: 'Kiểu cân',
							// 	render: (data: IReviewDryness) => (
							// 		<>
							// 			{/* {data?.isBatch == TYPE_BATCH.CAN_LO && 'Cân lô   '}
							// 			{data?.isBatch == TYPE_BATCH.CAN_LE && 'Cân lẻ'} */}
							// 		</>
							// 	),
							// },

							{
								title: 'Khách hàng',
								render: (data: IReviewDryness) => <>{data?.customerUu?.name || '---'}</>,
							},
							// {
							// 	title: 'Loại hàng',
							// 	render: (data: IReviewDryness) => <>{data?.producTypeUu?.name || '---'}</>,
							// },
							{
								title: 'KL hàng tươi (Tấn)',
								render: (data: IReviewDryness) => <>{convertWeight(data?.weightMt)}</>,
							},
							{
								title: 'Tổng lượng quy khô cũ (Tấn)',
								render: (data: IReviewDryness) => <>{convertWeight(data?.weightBdmtOld)}</>,
							},
							{
								title: 'Tổng lượng quy khô mới (Tấn)',
								render: (data: IReviewDryness) => <>{convertWeight(data?.weightBdmtNew)}</>,
							},

							// {
							// 	title: 'Quy cách',
							// 	render: (data: IReviewDryness) => <p>{data?.specificationsUu?.name || '---'}</p>,
							// },
							{
								title: 'Độ khô cũ',
								render: (data: IReviewDryness) => <p className={styles.dryness}>{data?.drynessOld?.toFixed(2)} %</p>,
							},
							{
								title: 'Độ khô mới',
								render: (data: IReviewDryness) => <p className={styles.dryness}>{data?.drynessNew?.toFixed(2)} %</p>,
							},
							// {
							// 	title: 'Thời gian gửi',
							// 	render: (data: IReviewDryness) => <Moment date={data?.updatedTime} format='HH:mm, DD/MM/YYYY' />,
							// },
							{
								title: 'Thành tiền cũ',
								render: (data: IReviewDryness) => <p>{convertCoin(data?.moneyOld) || 0}</p>,
							},
							{
								title: 'Thành tiền mới',
								render: (data: IReviewDryness) => <p>{convertCoin(data?.moneyNew) || 0}</p>,
							},
							{
								title: 'Người thay đổi',
								render: (data: IReviewDryness) => <>{data?.accountUu?.username || '---'}</>,
							},
							{
								title: 'Người duyệt',
								render: (data: IReviewDryness) => <>{data?.reporterUu?.username || '---'}</>,
							},
							{
								title: 'Trạng thái',
								render: (data: IReviewDryness) => (
									<StateActive
										stateActive={data?.status}
										listState={[
											{
												state: STATUS_CONFIRM.DA_HUY,
												text: 'Đã từ chối',
												textColor: '#F95B5B',
												backgroundColor: 'rgba(249, 91, 91, 0.10)',
											},
											{
												state: STATUS_CONFIRM.DANG_DOI,
												text: 'Đang chờ duyệt',
												textColor: '#2D74FF',
												backgroundColor: 'rgba(45, 116, 255, 0.10)',
											},
											{
												state: STATUS_CONFIRM.DA_CHOT,
												text: 'Đã duyệt',
												textColor: '#41CD4F',
												backgroundColor: 'rgba(65, 205, 79, 0.1)',
											},
										]}
									/>
								),
							},
							{
								title: 'Lý do',
								render: (data: IReviewDryness) => (
									<TippyHeadless
										maxWidth={'100%'}
										interactive
										onClickOutside={() => setUuidDescription('')}
										visible={uuidDescription == data?.uuid}
										placement='bottom'
										render={(attrs) => (
											<div className={styles.main_description}>
												<p>{data?.description}</p>
											</div>
										)}
									>
										<Tippy content='Xem chi tiết lý do'>
											<p
												onClick={() => {
													if (!data.description) {
														return;
													} else {
														setUuidDescription(uuidDescription ? '' : data.uuid);
													}
												}}
												className={clsx(styles.description, {[styles.active]: uuidDescription == data.uuid})}
											>
												{data?.description || '---'}
											</p>
										</Tippy>
									</TippyHeadless>
								),
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: IReviewDryness) => (
									<>
										{data?.status == STATUS_CONFIRM.DANG_DOI && (
											<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
												<IconCustom
													edit
													icon={<TickCircle size={22} fontWeight={600} />}
													tooltip='Xác nhận'
													color='#2CAE39'
													onClick={() => setListSelectBillConfirm([data.uuid])}
												/>

												<IconCustom
													edit
													icon={<CloseCircle fontSize={20} fontWeight={600} />}
													tooltip='Từ chối'
													color='#D95656'
													onClick={() => setListSelectBillRemove([data.uuid])}
												/>
											</div>
										)}
									</>
								),
							},
						]}
					/>
				</DataWrapper>

				{/* {!queryWeightsession.isFetching && ( */}
				{!loading && (
					<Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 200}
						total={total}
						dependencies={[_pageSize, _keyword, _customerUuid, _status]}
					/>
				)}
			</div>
			{/* <Dialog
				green
				open={setUuidConfirm.length > 0}
				title='Xác nhận duyệt'
				note='Bạn có muốn thực hiện xác nhận duyệt yêu cầu này không?'
				onClose={() => setUuidConfirm([])}
				onSubmit={funcConfirm.mutate}
			/> */}
			<Popup
				open={listSelectBillConfirm.length > 0}
				onClose={() => {
					setListSelectBillConfirm([]);
				}}
			>
				<PopupConfirmDryness
					dataBillChangeDryness={listSelectBillConfirm}
					onClose={() => {
						setListSelectBillConfirm([]);
					}}
				/>
			</Popup>
			<Popup
				open={listSelectBillRemove.length > 0}
				onClose={() => {
					setListSelectBillRemove([]);
				}}
			>
				<PopupRemoveDryness
					dataBillChangeDryness={listSelectBillRemove}
					onClose={() => {
						setListSelectBillRemove([]);
					}}
				/>
			</Popup>
			{/* <Dialog
				danger
				open={setUuidReject.length > 0}
				title='Xác nhận duyệt'
				note='Bạn có muốn thực từ chối duyệt yêu cầu này không?'
				onClose={() => setUuidReject([])}
				onSubmit={funcReject.mutate}
			/> */}
		</div>
	);
}

export default MainReviewDryness;
