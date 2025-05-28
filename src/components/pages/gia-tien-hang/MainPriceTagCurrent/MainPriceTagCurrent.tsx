import React, {useEffect, useState} from 'react';

import {IPriceTag, PropsMainPriceTagCurrent} from './interfaces';
import styles from './MainPriceTagCurrent.module.scss';
import Search from '~/components/common/Search';
import {useRouter} from 'next/router';
import FilterCustom from '~/components/common/FilterCustom';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATE_SPEC_CUSTOMER,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	TYPE_PRODUCT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Button from '~/components/common/Button';
import {PATH} from '~/constants/config';
import icons from '~/constants/images/icons';
import Image from 'next/image';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import wareServices from '~/services/wareServices';
import Pagination from '~/components/common/Pagination';
import priceTagServices from '~/services/priceTagServices';
import {convertCoin} from '~/common/funcs/convertCoin';
import Moment from 'react-moment';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import Popup from '~/components/common/Popup';
import FormUpdatePriceTag from '../FormUpdatePriceTag';
import Link from 'next/link';
import {FaHistory} from 'react-icons/fa';
import TagStatusSpecCustomer from './TagStatusSpecCustomer';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';
import SelectFilterState from '~/components/common/SelectFilterState';
import companyServices from '~/services/companyServices';

function MainPriceTagCurrent({}: PropsMainPriceTagCurrent) {
	const router = useRouter();

	const {_page, _pageSize, _keyword, _state, _parentUserUuid, _userUuid, _transportType, _status} = router.query;

	const [dataUpdate, setDataUpdate] = useState<IPriceTag | null>(null);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [uuidSpec, setUuidSpec] = useState<string>('');
	const [uuidProduct, setUuidProduct] = useState<string>('');
	const [uuidQuality, setUuidQuality] = useState<string>('');

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
		// enabled: !!uuidProduct && !!uuidQuality,
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

	const listPriceTag = useQuery(
		[
			QUERY_KEY.table_gia_tien_hang,
			_page,
			_pageSize,
			_keyword,
			_parentUserUuid,
			_userUuid,
			_state,
			_transportType,
			_status,
			uuidCompany,
			uuidProduct,
			uuidQuality,
			uuidSpec,
		],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					http: priceTagServices.listPriceTag({
						page: Number(_page) || 1,
						pageSize: Number(_pageSize) || 200,
						keyword: (_keyword as string) || '',
						isPaging: CONFIG_PAGING.IS_PAGING,
						isDescending: CONFIG_DESCENDING.NO_DESCENDING,
						typeFind: CONFIG_TYPE_FIND.TABLE,
						// status: !!_status ? Number(_status) : null,
						status: CONFIG_STATUS.HOAT_DONG,
						customerUuid: '',
						specUuid: uuidSpec,
						productTypeUuid: uuidProduct,
						priceTagUuid: '',
						state: !!_state ? Number(_state) : null,
						transportType: !!_transportType ? Number(_transportType) : null,
						userUuid: (_userUuid as string) || '',
						parentUserUuid: (_parentUserUuid as string) || '',
						companyUuid: uuidCompany,
						qualityUuid: uuidQuality,
					}),
				}),
			select(data) {
				return data;
			},
		}
	);

	useEffect(() => {
		if (_parentUserUuid) {
			router.replace(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						_userUuid: null,
					},
				},
				undefined,
				{shallow: true, scroll: false}
			);
		}
	}, [_parentUserUuid]);

	useEffect(() => {
		if (uuidProduct || uuidQuality) {
			setUuidSpec('');
		}
	}, [uuidProduct, uuidQuality]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo nhà cung cấp, công ty' />
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
					{/* <div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Loại hàng'
							query='_productTypeUuid'
							listFilter={listProductType?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div> */}
					<div className={styles.filter}>
						<SelectFilterState
							uuid={uuidProduct}
							setUuid={setUuidProduct}
							listData={listProductType?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Loại hàng'
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
						<SelectFilterState
							uuid={uuidQuality}
							setUuid={setUuidQuality}
							listData={listQuality?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Quốc gia'
						/>
					</div>

					<div className={styles.filter}>
						<SelectFilterState
							uuid={uuidSpec}
							setUuid={setUuidSpec}
							listData={listSpecifications?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Quy cách'
						/>
					</div>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='QLNH'
							query='_parentUserUuid'
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
							query='_userUuid'
							listFilter={listUserMarket?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.fullName,
							}))}
						/>
					</div>

					{/* <div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Quy cách'
							query='_specUuid'
							listFilter={listSpecifications?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div> */}

					{/* <div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Cung cấp'
							query='_state'
							listFilter={[
								{
									id: CONFIG_STATE_SPEC_CUSTOMER.CHUA_CUNG_CAP,
									name: 'Có thể cung cấp',
								},
								{
									id: CONFIG_STATE_SPEC_CUSTOMER.DANG_CUNG_CAP,
									name: 'Đang cung cấp',
								},
							]}
						/>
					</div> */}
				</div>
				<div>
					<Button p_8_16 rounded_2 href={PATH.ThemGiaTien} icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}>
						Thêm giá tiền
					</Button>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listPriceTag?.data?.items || []}
					loading={listPriceTag?.isLoading}
					noti={
						<Noti
							titleButton='Thêm giá tiền'
							onClick={() => router.push('/gia-tien-hang/them-moi')}
							des='Hiện tại chưa có giá tiền nào, thêm ngay?'
						/>
					}
				>
					<Table
						data={listPriceTag?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IPriceTag, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Nhà cung cấp',
								fixedLeft: true,
								render: (data: IPriceTag) => (
									<Link href={`/xuong/${data?.customerUu?.uuid}`} className={styles.link}>
										{data?.customerUu?.name || '---'}
									</Link>
								),
							},
							{
								title: 'Kv cảng xuất khẩu',
								render: (data: IPriceTag) => <>{data?.customerUu?.companyUu?.name || '---'}</>,
							},
							{
								title: 'Giá tiền (VNĐ)',
								render: (data: IPriceTag) => <>{convertCoin(data?.pricetagUu?.amount) || 0} </>,
							},
							// {
							// 	title: 'Công ty',
							// 	render: (data: IPriceTag) => (
							// 		<Link href={`/nha-cung-cap/${data?.partnerUu?.uuid}`} className={styles.link}>
							// 			{data?.partnerUu?.name || '---'}
							// 		</Link>
							// 	),
							// },
							{
								title: 'Loại hàng',
								render: (data: IPriceTag) => <>{data?.productTypeUu?.name || '---'}</>,
							},
							{
								title: 'Vận chuyển',
								render: (data: IPriceTag) => (
									<>
										{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
										{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
									</>
								),
							},
							{
								title: 'Quốc gia',
								render: (data: IPriceTag) => <>{data?.qualityUu?.name || '---'}</>,
							},
							{
								title: 'Quy cách',
								render: (data: IPriceTag) => <>{data?.specUu?.name || '---'}</>,
							},

							{
								title: 'Cung cấp',
								render: (data: any) => <TagStatusSpecCustomer status={data.state} />,
							},
							{
								title: 'Ngày tạo',
								render: (data: IPriceTag) =>
									data.created ? <Moment date={data.created} format='HH:mm, DD/MM/YYYY' /> : '---',
							},
							{
								title: 'Tác vụ',
								selectRow: true,
								fixedRight: true,
								render: (data: IPriceTag) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											icon={<FaHistory fontSize={20} fontWeight={600} />}
											tooltip='Xem lịch sử'
											color='#777E90'
											href={`/gia-tien-hang/lich-su?_customerUuid=${data?.customerUu?.uuid || ''}&_specUuid=${
												data?.specUu?.uuid || ''
											}&_productTypeUuid=${data?.productTypeUu?.uuid || ''}&_transportType=${
												data?.transportType || ''
											}`}
										/>
										<IconCustom
											icon={<LuPencil size='22' />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											onClick={() => setDataUpdate(data)}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listPriceTag?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _keyword, _transportType, _status, uuidCompany, uuidProduct, uuidQuality, uuidSpec]}
				/>
			</div>

			{/* Popup */}
			<Popup open={!!dataUpdate} onClose={() => setDataUpdate(null)}>
				<FormUpdatePriceTag dataUpdate={dataUpdate} onClose={() => setDataUpdate(null)} />
			</Popup>
		</div>
	);
}

export default MainPriceTagCurrent;
