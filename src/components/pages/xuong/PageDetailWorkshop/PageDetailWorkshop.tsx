import React, {useState} from 'react';

import {IDetailCustomer, IlistCustomerSpec, PropsPageDetailWorkshop} from './interfaces';
import styles from './PageDetailWorkshop.module.scss';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import {LuPencil} from 'react-icons/lu';
import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CUSTOMER,
	TYPE_PARTNER,
	TYPE_SIFT,
	TYPE_TRANSPORT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import TagStatus from '~/components/common/TagStatus';
import {getTextAddress} from '~/common/funcs/optionConvert';
import Loading from '~/components/common/Loading';
import priceTagServices from '~/services/priceTagServices';
import Dialog from '~/components/common/Dialog';
import Popup from '~/components/common/Popup';
import DataWrapper from '~/components/common/DataWrapper';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Image from 'next/image';
import icons from '~/constants/images/icons';

import {convertCoin} from '~/common/funcs/convertCoin';
import PopupAddPrice from '../PopupAddPrice/PopupAddPrice';
import TagStatusSpecCustomer from '../TagStatusSpecCustomer';
import IconCustom from '~/components/common/IconCustom';
import PopupUpdatePrice from '../PopupUpdatePrice';
import TabNavLink from '~/components/common/TabNavLink';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import TableImport from '../TableImport';

function PageDetailWorkshop({}: PropsPageDetailWorkshop) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id, _page, _typeCus, _pageSize, _type} = router.query;

	const [uuidUpdate, setUuidUpdate] = useState<string>('');
	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);

	const {data: detailCustomer} = useQuery<IDetailCustomer>([QUERY_KEY.chi_tiet_khach_hang, _id], {
		queryFn: () =>
			httpRequest({
				http: customerServices.getDetail({
					uuid: _id as string,
				}),
			}),
		onSuccess(data) {
			return data;
		},
		enabled: !!_id,
	});

	const funcChangeStatus = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: detailCustomer?.status == STATUS_CUSTOMER.HOP_TAC ? 'Dừng hoạt động thành công' : 'Mở khóa thành công',
				http: customerServices.changeStatus({
					uuid: detailCustomer?.uuid!,
					status: detailCustomer?.status! == STATUS_CUSTOMER.HOP_TAC ? STATUS_CUSTOMER.DUNG_HOP_TAC : STATUS_CUSTOMER.HOP_TAC,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenChangeStatus(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_khach_hang, _id]);
			}
		},
	});

	// const listPriceTagCustomer = useQuery([QUERY_KEY.table_hang_hoa_cua_khach_hang, _id, _page, _pageSize], {
	// 	queryFn: () =>
	// 		httpRequest({
	// 			isList: true,
	// 			http: priceTagServices.listPriceTag({
	// 				page: Number(_page) || 1,
	// 				pageSize: Number(_pageSize) || 200,
	// 				keyword: '',
	// 				isPaging: CONFIG_PAGING.IS_PAGING,
	// 				isDescending: CONFIG_DESCENDING.NO_DESCENDING,
	// 				typeFind: CONFIG_TYPE_FIND.TABLE,
	// 				status: null,
	// 				customerUuid: _id as string,
	// 				specUuid: '',
	// 				productTypeUuid: '',
	// 				priceTagUuid: '',
	// 				state: null,
	// 				transportType: null,
	// 			}),
	// 		}),
	// 	select(data) {
	// 		return data;
	// 	},
	// 	enabled: !!_id,
	// });

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatus.isLoading} />
			<div className={styles.header}>
				<Link
					href={'#'}
					onClick={(e) => {
						e.preventDefault();
						window.history.back();
					}}
					className={styles.header_title}
				>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>
						Chi tiết{' '}
						{TYPE_PARTNER.KH_XUAT === Number(_typeCus)
							? 'khách hàng'
							: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
							? 'khách hàng'
							: TYPE_PARTNER.NCC === Number(_typeCus)
							? 'nhà cung cấp'
							: 'nhà cung cấp'}{' '}
						{detailCustomer?.code}
					</p>
				</Link>

				{detailCustomer?.status != STATUS_CUSTOMER.DA_XOA && (
					<div className={styles.list_btn}>
						<Button
							rounded_2
							w_fit
							light_outline
							p_8_16
							bold
							href={`/xuong/chinh-sua?_customerUuid=${detailCustomer?.uuid}&_typeCus=${_typeCus}`}
							icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}
						>
							Chỉnh sửa
						</Button>
						<Button
							rounded_2
							w_fit
							light_outline
							p_8_16
							bold
							icon={
								detailCustomer?.status == CONFIG_STATUS.HOAT_DONG ? (
									<HiOutlineLockClosed color='#23262F' fontSize={16} fontWeight={600} />
								) : (
									<HiOutlineLockOpen color='#23262F' fontSize={16} fontWeight={600} />
								)
							}
							onClick={() => setOpenChangeStatus(true)}
						>
							{detailCustomer?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa' : 'Mở khóa'}
						</Button>
					</div>
				)}
			</div>

			<div className={clsx('mt')}>
				<table className={styles.container_table}>
					<colgroup>
						<col style={{width: '50%'}} />
						<col style={{width: '50%'}} />
					</colgroup>
					<tr>
						<td>
							<span>
								Mã{' '}
								{TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.NCC === Number(_typeCus)
									? 'nhà cung cấp'
									: 'nhà cung cấp'}
								:{' '}
							</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.code || '---'}</span>
						</td>
						<td>
							<span>
								Tên{' '}
								{TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.NCC === Number(_typeCus)
									? 'nhà cung cấp'
									: 'nhà cung cấp'}
								:{' '}
							</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.name || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Phân loại hàng:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>
								{detailCustomer?.isSift == TYPE_SIFT.CAN_SANG
									? 'Cần sàng'
									: detailCustomer?.isSift == TYPE_SIFT.KHONG_CAN_SANG
									? 'Không cần sàng'
									: '---'}
							</span>
						</td>
						<td>
							<span>Người liên hệ:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.director || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Email: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.email || '---'}</span>
						</td>
						<td>
							<span>Số điện thoại:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailCustomer?.phoneNumber || '---'}</span>
						</td>
					</tr>

					<tr>
						<td>
							<span>Loại vận chuyển:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>
								{detailCustomer?.transportType == TYPE_TRANSPORT.DUONG_BO
									? 'Đường bộ'
									: detailCustomer?.transportType == TYPE_TRANSPORT.DUONG_THUY
									? 'Đường thủy'
									: '---'}
							</span>
						</td>
						<td rowSpan={3} className={styles.description}>
							<span>Mô tả:</span>
							<span style={{marginLeft: '6px'}}>{detailCustomer?.description || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Trạng thái: </span>
								<span style={{marginLeft: '6px'}}>
									<TagStatus status={detailCustomer?.status!} />
								</span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<span>Địa chỉ:</span>
							<span style={{marginLeft: '6px'}}>
								{getTextAddress(detailCustomer?.detailAddress, detailCustomer?.address)}
							</span>
						</td>
					</tr>
				</table>
			</div>

			<div className={clsx('mt')}>
				<TabNavLink
					listHref={[
						{
							title: 'Danh sách hàng hóa',
							pathname: router.pathname,
							query: null,
						},
						{
							title: 'Lịch sử nhập hàng',
							pathname: router.pathname,
							query: 'history-import',
						},
					]}
					query='_type'
				/>
			</div>
			<FullColumnFlex>
				{!_type && (
					<>
						<div className={clsx('mt')}>
							<div className={styles.main_table}>
								{/* <h1 className={styles.list_title}>Danh sách hàng hóa</h1> */}
								<div></div>
								{detailCustomer?.status != STATUS_CUSTOMER.DA_XOA && (
									<div>
										<Button
											p_8_16
											icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
											rounded_2
											onClick={() => setOpenCreate(true)}
										>
											Thêm loại hàng
										</Button>
									</div>
								)}
							</div>
						</div>

						<div className={clsx('mt')}>
							<div className={styles.table}>
								<DataWrapper
									data={detailCustomer?.customerSpec || []}
									// loading={detailCustomer.isloading}
									noti={<Noti disableButton des='Hiện tại chưa có hàng hóa nào!' />}
								>
									<Table
										data={detailCustomer?.customerSpec || []}
										column={[
											{
												title: 'STT',
												render: (data: IlistCustomerSpec, index: number) => <>{index + 1}</>,
											},
											{
												title: 'Loại hàng',
												fixedLeft: true,
												render: (data: IlistCustomerSpec) => <>{data?.productTypeUu?.name || '---'}</>,
											},
											{
												title: 'Quốc gia',
												render: (data: IlistCustomerSpec) => <>{data?.qualityUu?.name || '---'}</>,
											},
											{
												title: 'Quy cách',
												render: (data: IlistCustomerSpec) => <>{data?.specUu?.name || '---'}</>,
											},
											{
												title: 'Bãi',
												render: (data: IlistCustomerSpec) => <>{data?.storageUu?.name || '---'}</>,
											},
											{
												title: 'Vận chuyển',
												render: (data: IlistCustomerSpec) => (
													<>
														{data?.transportType == TYPE_TRANSPORT.DUONG_BO && 'Đường bộ'}
														{data?.transportType == TYPE_TRANSPORT.DUONG_THUY && 'Đường thủy'}
													</>
												),
											},
											{
												title: 'Giá tiền (VNĐ)',
												render: (data: IlistCustomerSpec) => (
													<p style={{fontWeight: '600', color: '#3772FF'}}>
														{convertCoin(data?.pricetagUu?.amount)}
													</p>
												),
											},
											{
												title: 'Cung cấp',
												render: (data: IlistCustomerSpec) => <TagStatusSpecCustomer status={data.state} />,
											},
											{
												title: 'Tác vụ',
												fixedRight: true,
												render: (data: IlistCustomerSpec) => (
													<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
														<IconCustom
															edit
															icon={<LuPencil fontSize={20} fontWeight={600} />}
															tooltip='Cập nhật bãi'
															color='#777E90'
															onClick={() => setUuidUpdate(data?.uuid)}
														/>
													</div>
												),
											},
										]}
									/>
								</DataWrapper>
								{/* <Pagination
						currentPage={Number(_page) || 1}
						pageSize={Number(_pageSize) || 200}
						total={listPriceTagCustomer?.data?.pagination?.totalCount}
						dependencies={[_id, _pageSize]}
					/> */}
							</div>
						</div>
					</>
				)}
				{_type == 'history-import' && <TableImport uuid={_id as string} />}
			</FullColumnFlex>

			<Dialog
				danger
				open={openChangeStatus}
				onClose={() => setOpenChangeStatus(false)}
				title={
					detailCustomer?.status == CONFIG_STATUS.HOAT_DONG
						? `Khóa ${
								TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.NCC === Number(_typeCus)
									? 'nhà cung cấp'
									: 'nhà cung cấp'
						  }`
						: `Mở khóa ${
								TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.NCC === Number(_typeCus)
									? 'nhà cung cấp'
									: 'nhà cung cấp'
						  }`
				}
				note={
					detailCustomer?.status == CONFIG_STATUS.HOAT_DONG
						? `Bạn có chắc chắn muốn khóa ${
								TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.NCC === Number(_typeCus)
									? 'nhà cung cấp'
									: 'nhà cung cấp'
						  } này?`
						: `Bạn có chắc chắn muốn mở khóa ${
								TYPE_PARTNER.KH_XUAT === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.KH_DICH_VU === Number(_typeCus)
									? 'khách hàng'
									: TYPE_PARTNER.NCC === Number(_typeCus)
									? 'nhà cung cấp'
									: 'nhà cung cấp'
						  } này?`
				}
				onSubmit={funcChangeStatus.mutate}
			/>

			<Popup open={openCreate} onClose={() => setOpenCreate(false)}>
				<PopupAddPrice
					customerName={detailCustomer?.name!}
					typePartner={detailCustomer?.partnerUu?.type}
					onClose={() => setOpenCreate(false)}
				/>
			</Popup>

			<Popup open={!!uuidUpdate} onClose={() => setUuidUpdate('')}>
				<PopupUpdatePrice customerSpecUuid={uuidUpdate} onClose={() => setUuidUpdate('')} />
			</Popup>
		</div>
	);
}

export default PageDetailWorkshop;
