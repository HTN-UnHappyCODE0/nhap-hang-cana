import React, {useState} from 'react';
import {IFormCreatePriceTagUpdate, PropsCreatePriceTagUpdate} from './interfaces';
import styles from './CreatePriceTagUpdate.module.scss';
import Button from '~/components/common/Button';
import Form from '~/components/common/Form';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {
	CONFIG_DESCENDING,
	CONFIG_STATUS,
	CONFIG_PAGING,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	TYPE_TRANSPORT,
	TYPE_SCALES,
	STATUS_BILL,
	TYPE_PRODUCT,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import {useMutation, useQuery} from '@tanstack/react-query';
import DataWrapper from '~/components/common/DataWrapper';
import Table from '~/components/common/Table';
import customerServices from '~/services/customerServices';
import wareServices from '~/services/wareServices';
import priceTagServices from '~/services/priceTagServices';
import SelectSearch from '~/components/common/SelectSearch';
import batchBillServices from '~/services/batchBillServices';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {convertCoin} from '~/common/funcs/convertCoin';
import Pagination from '~/components/common/Pagination';
import {convertWeight, timeSubmit} from '~/common/funcs/optionConvert';
import DatePicker from '~/components/common/DatePicker';
import {toastWarn} from '~/common/funcs/toast';
import Search from '~/components/common/Search';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import Loading from '~/components/common/Loading';
import Select, {Option} from '~/components/common/Select';
import {IoMdSearch} from 'react-icons/io';
import GridColumn from '~/components/layouts/GridColumn';
import Moment from 'react-moment';

function CreatePriceTagUpdate({}: PropsCreatePriceTagUpdate) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _dateFrom, _dateTo} = router.query;

	const [form, setForm] = useState<{
		timeStart: Date | null;
		timeEnd: Date | null;
		customerUuid: string;
		productUuid: string;
		specUuid: string;
		transformUuid: string;
	}>({
		timeStart: null,
		timeEnd: null,
		customerUuid: '',
		productUuid: '',
		specUuid: '',
		transformUuid: '',
	});

	const [dataTable, setDataTable] = useState<any[]>([]);
	const [priceTag, setPriceTag] = useState<any>({});

	const listCustomer = useQuery([QUERY_KEY.dropdown_xuong], {
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
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					provinceId: '',
					specUuid: '',
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

	const listSpecifications = useQuery([QUERY_KEY.dropdown_quy_cach, form.productUuid], {
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
					productTypeUuid: form.productUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!form.productUuid,
	});

	const listPriceTag = useQuery([QUERY_KEY.dropdown_gia_tien_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: priceTagServices.listPriceTagDropDown({
					page: 1,
					pageSize: 10,
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

	const getListBatchBill = useQuery([QUERY_KEY.table_phieu_can, _page, _pageSize, _keyword, _dateFrom, _dateTo], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: batchBillServices.getListBill({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					scalesType: [TYPE_SCALES.CAN_NHAP, TYPE_SCALES.CAN_TRUC_TIEP], // Can thang -> can truc tiep
					transportType: Number(form.transformUuid) || null,
					isBatch: null,
					isCreateBatch: null,
					productTypeUuid: form?.productUuid || '',
					specificationsUuid: form?.specUuid || '',
					status: [STATUS_BILL.DA_CAN_CHUA_KCS, STATUS_BILL.DA_KCS, STATUS_BILL.CHOT_KE_TOAN],
					timeStart: _dateFrom ? (_dateFrom as string) : null,
					timeEnd: _dateTo ? (_dateTo as string) : null,
					warehouseUuid: '',
					qualityUuid: '',
					scalesStationUuid: '',
					typeCheckDay: 0,
					truckPlates: [],
					customerUuid: '',
					listCustomerUuid: form?.customerUuid ? [form.customerUuid] : [],
					storageUuid: '',
					companyUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data) {
				setDataTable(
					data?.items?.map((v: any, index: number) => ({
						...v,
						index: index,
						isChecked: false,
					}))
				);
			}
		},
		select(data) {
			return data;
		},
		enabled: !!form.customerUuid && !!form.productUuid,
	});

	const funcFixPricetag = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thay đổi mới giá tiền chỉnh sửa thành công!',
				http: priceTagServices.fixPricetag({
					billUuids: dataTable?.filter((v: any) => v?.isChecked)?.map((x: any) => x?.uuid),
					customerUuid: form?.customerUuid || '',
					description: '',
					pricetagUuid: priceTag.id === '' ? String(priceTag.name) : priceTag.id,
					producTypeUuid: form?.productUuid || '',
					specificationUuid: form?.specUuid || '',
					transportType: Number(form.transformUuid) || null,
					timeStart: form.timeStart ? timeSubmit(form.timeStart) : null,
					timeEnd: form.timeEnd ? timeSubmit(form.timeEnd, true) : null,
				}),
			}),
		onSuccess(data) {
			if (data) {
				router.back();
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		if (priceTag.name === undefined || priceTag.name === '') {
			return toastWarn({msg: 'Vui lòng chọn giá tiền áp dụng!'});
		}
		if (dataTable?.filter((v: any) => v?.isChecked).length == 0) {
			return toastWarn({msg: 'Vui lòng chọn các phiếu muốn thay đổi!'});
		}
		if (!form.timeStart) {
			return toastWarn({msg: 'Vui lòng chọn ngày áp dụng!'});
		}
		if (!!form.timeEnd) {
			const timeStart = new Date(form.timeStart);
			const timeEnd = new Date(form.timeEnd);

			if (timeStart > timeEnd) {
				return toastWarn({msg: 'Ngày kết thúc không hợp lệ!'});
			}
		}

		return funcFixPricetag.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcFixPricetag.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.header}>
					<div className={styles.left}>
						<h4>Thay đổi giá tiền</h4>
						<p>Điền đầy đủ các thông tin</p>
					</div>
					<div className={styles.right}>
						<Button onClick={() => router.back()} p_10_24 rounded_2 grey_outline>
							Hủy bỏ
						</Button>
						<Button p_10_24 rounded_2 primary onClick={handleSubmit} disable={!form?.timeStart || !priceTag.name}>
							Lưu lại
						</Button>
					</div>
				</div>
				<div className={styles.form}>
					<div className={clsx('mt')}>
						<GridColumn col_5>
							<Select
								isSearch
								name='customerUuid'
								placeholder='Chọn nhà cung cấp'
								value={form?.customerUuid}
								label={
									<span>
										Nhà cung cấp <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listCustomer?.data?.map((v: any) => (
									<Option
										key={v?.uuid}
										value={v?.uuid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												customerUuid: v.uuid,
											}))
										}
									/>
								))}
							</Select>
							<div>
								<Select
									isSearch
									name='productUuid'
									placeholder='Chọn loại hàng'
									value={form?.productUuid}
									label={
										<span>
											Loại hàng <span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									{listProductType?.data?.map((v: any) => (
										<Option
											key={v?.uuid}
											value={v?.uuid}
											title={v?.name}
											onClick={() =>
												setForm((prev: any) => ({
													...prev,
													productUuid: v.uuid,
													specUuid: '',
												}))
											}
										/>
									))}
								</Select>
							</div>
							<Select
								isSearch
								name='specUuid'
								placeholder='Chọn quy cách  '
								value={form?.specUuid}
								label={<span>Quy cách</span>}
								readOnly={!form.productUuid}
							>
								{listSpecifications?.data?.map((v: any) => (
									<Option
										key={v?.uuid}
										value={v?.uuid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												specUuid: v.uuid,
											}))
										}
									/>
								))}
							</Select>
							<div>
								<Select
									isSearch
									name='transformUuid'
									placeholder='Chọn vận chuyển'
									value={form?.transformUuid}
									label={<span>Vận chuyển</span>}
								>
									<Option
										value={'0'}
										title={'Đường bộ'}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												transformUuid: '0',
											}))
										}
									/>
									<Option
										value={'1'}
										title={'Đường thủy'}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												transformUuid: '1',
											}))
										}
									/>
								</Select>
							</div>
							<div className={styles.btn}>
								<Button
									p_10_24
									rounded_2
									disable={!form?.customerUuid || !form?.productUuid}
									primary
									icon={<IoMdSearch size={20} />}
									onClick={() => {
										getListBatchBill.refetch();
									}}
								>
									Tìm kiếm phiếu hàng theo bộ lọc
								</Button>
							</div>
						</GridColumn>
					</div>
					<div className={clsx('mt', 'col_3')}>
						<SelectSearch
							isConvertNumber={true}
							options={listPriceTag?.data?.map((v: any) => ({
								id: v?.uuid,
								name: String(v?.amount),
							}))}
							data={priceTag}
							setData={setPriceTag}
							label={
								<span>
									Giá tiền mới <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập giá tiền'
							unit='VNĐ'
						/>
						<DatePicker
							icon={true}
							label={
								<span>
									Áp dụng từ ngày <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày áp dụng'
							value={form?.timeStart}
							onSetValue={(date) =>
								setForm((prev) => ({
									...prev,
									timeStart: date,
								}))
							}
							name='timeStart'
							onClean={true}
						/>
						<DatePicker
							icon={true}
							label={<span>Ngày kết thúc</span>}
							placeholder='Chọn ngày kết thúc'
							value={form?.timeEnd}
							onSetValue={(date) =>
								setForm((prev) => ({
									...prev,
									timeEnd: date,
								}))
							}
							name='timeEnd'
							onClean={true}
						/>
					</div>
					<div className='mt'>
						<h1>Danh sách phiếu hàng đã chọn ({dataTable?.filter((v: any) => v?.isChecked)?.length})</h1>
					</div>
					<div className={clsx('mt', styles.main_search)}>
						<div className={styles.search}>
							<Search placeholder='Tìm kiếm theo mã lô hàng...' keyName='_keyword' />
						</div>
						<div className={styles.filter}>
							<DateRangerCustom titleTime='Thời gian' />
						</div>
					</div>
					<div className={clsx('mt')}>
						<div className={styles.table}>
							<DataWrapper
								loading={getListBatchBill.isFetching}
								data={dataTable || []}
								noti={<Noti des='Hiện tại chưa có danh sách phiếu hàng nào!' disableButton />}
							>
								<Table
									data={dataTable || []}
									onSetData={setDataTable}
									column={[
										{
											title: 'STT',
											checkBox: true,
											render: (data: IFormCreatePriceTagUpdate, index: number) => <span>{index + 1}</span>,
										},
										{
											title: 'Mã lô hàng',
											fixedLeft: true,
											render: (data: IFormCreatePriceTagUpdate) => <span>{data?.code}</span>,
										},
										{
											title: 'Loại hàng',
											render: (data: IFormCreatePriceTagUpdate) => <>{data?.productTypeUu?.name}</>,
										},
										{
											title: 'Quy cách',
											render: (data: IFormCreatePriceTagUpdate) => <>{data?.specificationsUu?.name || '---'}</>,
										},

										{
											title: 'Vận chuyển',
											render: (data: IFormCreatePriceTagUpdate) => (
												<>
													{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
													{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
												</>
											),
										},
										{
											title: 'Khối lượng hàng (Tấn)',
											render: (data: IFormCreatePriceTagUpdate) => <>{convertWeight(data?.weightTotal)}</>,
										},
										{
											title: 'Giá tiền (VNĐ)',
											render: (data: IFormCreatePriceTagUpdate) => <>{convertCoin(data?.pricetagUu?.amount)}</>,
										},
										{
											title: 'Tổng giá tiền hàng (VNĐ)',
											render: (data: IFormCreatePriceTagUpdate) => <>{convertCoin(data?.moneyTotal)}</>,
										},
										{
											title: 'Ngày nhập hàng',
											render: (data: IFormCreatePriceTagUpdate) =>
												data?.timeEnd ? <Moment date={data?.timeEnd} format='DD/MM/YYYY' /> : '---',
										},
									]}
								/>
							</DataWrapper>
							<Pagination
								currentPage={Number(_page) || 1}
								pageSize={Number(_pageSize) || 200}
								total={getListBatchBill?.data?.pagination?.totalCount}
								dependencies={[_pageSize, _keyword, _dateFrom, _dateTo]}
							/>
						</div>
					</div>
				</div>
				{/* <div className={styles.form}>
					<div className={clsx('mt', 'col_3')}>
						<SelectSearch
							isConvertNumber={true}
							options={listPriceTag?.data?.map((v: any) => ({
								id: v?.uuid,
								name: String(v?.amount),
							}))}
							data={priceTag}
							setData={setPriceTag}
							label={
								<span>
									Giá tiền mới <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Nhập giá tiền'
							unit='VNĐ'
						/>
						<DatePicker
							icon={true}
							label={
								<span>
									Áp dụng từ ngày <span style={{color: 'red'}}>*</span>
								</span>
							}
							placeholder='Chọn ngày áp dụng'
							value={form?.timeStart}
							onSetValue={(date) =>
								setForm((prev) => ({
									...prev,
									timeStart: date,
								}))
							}
							name='timeStart'
							onClean={true}
						/>
						<DatePicker
							icon={true}
							label={<span>Ngày kết thúc</span>}
							placeholder='Chọn ngày kết thúc'
							value={form?.timeEnd}
							onSetValue={(date) =>
								setForm((prev) => ({
									...prev,
									timeEnd: date,
								}))
							}
							name='timeEnd'
							onClean={true}
						/>
					</div>

					<div className='mt'>
						<h1>Danh sách phiếu hàng ({dataTable?.filter((v: any) => v?.isChecked)?.length})</h1>
					</div>

					<div className={clsx('mt', styles.main_search)}>
						<div className={styles.search}>
							<Search placeholder='Tìm kiếm ...' keyName='_keyword' />
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='NCC'
								query='_partnerUuid'
								listFilter={listPartner?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>
						<div className={styles.filter}>
							<FilterCustom
								isSearch
								name='NCC'
								query='_customerUuid'
								listFilter={listCustomer?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
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
								name='Quy cách'
								query='_specificationUuid'
								listFilter={listSpecifications?.data?.map((v: any) => ({
									id: v?.uuid,
									name: v?.name,
								}))}
							/>
						</div>
						<div className={styles.filter}>
							<DateRangerCustom titleTime='Thời gian' />
						</div>
					</div>

					<div className={clsx('mt')}>
						<div className={styles.table}>
							<DataWrapper
								loading={getListBatchBill.isFetching}
								data={dataTable || []}
								noti={<Noti des='Hiện tại chưa có danh sách phiếu hàng nào!' disableButton />}
							>
								<Table
									data={dataTable || []}
									onSetData={setDataTable}
									column={[
										{
											title: 'STT',
											checkBox: true,
											render: (data: any, index: number) => <>{index + 1}</>,
										},
										{
											title: 'Mã lô hàng',
											render: (data: any) => <>{data?.code}</>,
										},
										{
											title: 'Loại hàng',
											render: (data: any) => <>{data?.productTypeUu?.name}</>,
										},
										{
											title: 'Quy cách',
											render: (data: any) => <>{data?.specificationsUu?.name || '---'}</>,
										},
										{
											title: 'Vận chuyển',
											render: (data: any) => (
												<>
													{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
													{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
												</>
											),
										},
										{
											title: 'Khối lượng hàng (Tấn)',
											render: (data: any) => <>{convertWeight(data?.weightTotal)}</>,
										},
										{
											title: 'Giá tiền (VNĐ)',
											render: (data: any) => <>{convertCoin(data?.moneyTotal)}</>,
										},
									]}
								/>
							</DataWrapper>
							<Pagination
								currentPage={Number(_page) || 1}
								pageSize={Number(_pageSize) || 200}
								total={1}
								dependencies={[
									_pageSize,
									_keyword,
									_partnerUuid,
									_customerUuid,
									_productTypeUuid,
									_transportType,
									_specificationUuid,
									_dateFrom,
									_dateTo,
								]}
							/>
						</div>
					</div>
				</div> */}
			</Form>
		</div>
	);
}

export default CreatePriceTagUpdate;
