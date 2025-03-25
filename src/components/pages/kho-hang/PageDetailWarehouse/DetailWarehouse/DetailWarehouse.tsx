import React, {useState} from 'react';
import {IDetailWarehouse, PropsDetailWarehouse} from './interfaces';
import styles from './DetailWarehouse.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import Button from '~/components/common/Button';
import GridColumn from '~/components/layouts/GridColumn';
import DetailBox from '~/components/common/DetailBox';
import TabNavLink from '~/components/common/TabNavLink';
import {useRouter} from 'next/router';
import TableHistoryStorage from './components/TableHistoryStorage';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_STATUS, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Moment from 'react-moment';
import warehouseServices from '~/services/warehouseServices';
import TagStatus from '~/components/common/TagStatus';
import TableListStorage from './components/TableListStorage';
import TableMapStorage from './components/TableMapStorage';
import clsx from 'clsx';
import {PiSealWarningFill} from 'react-icons/pi';
import {convertWeight} from '~/common/funcs/optionConvert';
import {LuPencil} from 'react-icons/lu';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import Dialog from '~/components/common/Dialog';
import Loading from '~/components/common/Loading';

function DetailWarehouse({}: PropsDetailWarehouse) {
	const router = useRouter();

	const queryClient = useQueryClient();

	const {_id, _type} = router.query;

	const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);

	const {data: detailWarehouse} = useQuery<IDetailWarehouse>([QUERY_KEY.chi_tiet_kho_hang, _id], {
		queryFn: () =>
			httpRequest({
				http: warehouseServices.detailWarehouse({
					uuid: _id as string,
				}),
			}),

		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	const funcChangeStatusWarehouse = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess:
					detailWarehouse?.status == CONFIG_STATUS.HOAT_DONG
						? 'Khóa kho hàng chính thành công!'
						: 'Mở khóa kho hàng chính thành công!',
				http: warehouseServices.changeStatusWarehouse({
					uuid: detailWarehouse?.uuid!,
					status: detailWarehouse?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenChangeStatus(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_kho_hang, _id]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatusWarehouse.isLoading} />
			<div className={styles.header}>
				<Link
					href={PATH.Home}
					onClick={(e) => {
						e.preventDefault();
						window.history.back();
					}}
					className={styles.header_title}
				>
					<IoArrowBackOutline fontSize={20} fontWeight={600} />
					<p>Chi tiết kho {detailWarehouse?.name}</p>
				</Link>
				<div className={styles.list_btn}>
					<Button
						rounded_2
						w_fit
						light_outline
						p_8_16
						bold
						icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}
						onClick={() => router.push(`/kho-hang/chinh-sua?_id=${_id}`)}
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
							detailWarehouse?.status == CONFIG_STATUS.HOAT_DONG ? (
								<HiOutlineLockClosed color='#23262F' fontSize={16} fontWeight={600} />
							) : (
								<HiOutlineLockOpen color='#23262F' fontSize={16} fontWeight={600} />
							)
						}
						onClick={() => setOpenChangeStatus(true)}
					>
						{detailWarehouse?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa' : 'Mở khóa'}
					</Button>
				</div>
			</div>
			<div className={'mt'}>
				<GridColumn col_3>
					{/* <DetailBox
						name={'Tổng khối lượng hàng'}
						value={detailWarehouse?.totalAmountMT!}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<p>
										Đã KCS: <span>{convertWeight(detailWarehouse?.amountKCS!)}</span>
									</p>
									<p style={{marginTop: 2}}>
										Chưa KCS: <span>{convertWeight(detailWarehouse?.amountMT!)}</span>
									</p>
								</div>
							</div>
						}
					/> */}
					<DetailBox
						name={'Tổng khối lượng quy khô'}
						value={convertWeight(detailWarehouse?.totalAmountBDMT || 0)}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<p>
										Quy khô chuẩn: <span>{convertWeight(detailWarehouse?.amountBDMT!)}</span>
									</p>
									<p style={{marginTop: 2}}>
										Quy khô tạm tính: <span>{convertWeight(detailWarehouse?.amountBDMTDemo!)}</span>
									</p>
								</div>
							</div>
						}
					/>
					<DetailBox
						name={' Khối lượng nhập'}
						value={convertWeight(detailWarehouse?.totalAmountIn || 0)}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<p>
										Từ nhà cung cấp: <span>{convertWeight(detailWarehouse?.amountIn!)}</span>
									</p>
									<p style={{marginTop: 2}}>
										Từ kho: <span>{convertWeight(detailWarehouse?.amountChangeIn!)}</span>
									</p>
								</div>
							</div>
						}
					/>
					<DetailBox
						name={'Khối lượng xuất'}
						value={convertWeight(detailWarehouse?.totalAmountOut || 0)}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<p>
										Khách hàng xuất: <span>{convertWeight(detailWarehouse?.amountOut!)}</span>
									</p>
									<p style={{marginTop: 2}}>
										Chuyển kho: <span>{convertWeight(detailWarehouse?.amountChangeOut!)}</span>
									</p>
								</div>
							</div>
						}
					/>
				</GridColumn>
			</div>
			<div className={'mt'}>
				<table className={styles.container_table}>
					<colgroup>
						<col style={{width: '50%'}} />
						<col style={{width: '50%'}} />
					</colgroup>
					<tr>
						<td>
							<span>Mã kho hàng: </span>
							<span style={{marginLeft: '6px'}}>{detailWarehouse?.code || '---'}</span>
						</td>
						<td>
							<span>Thời gian tạo:</span>
							<span style={{marginLeft: '6px'}}>
								<Moment date={detailWarehouse?.created} format='HH:mm, DD/MM/YYYY' />
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Tên kho hàng: </span>
							<span style={{marginLeft: '6px'}}>{detailWarehouse?.name || '---'}</span>
						</td>
						<td>
							<span>Chỉnh sửa gần nhất:</span>
							<span style={{marginLeft: '6px'}}>
								<Moment date={detailWarehouse?.updatedTime} format='HH:mm, DD/MM/YYYY' />
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Tổng kho nhỏ: </span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailWarehouse?.storage?.length || '---'}</span>
						</td>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Trạng thái:</span>
								<span>
									<TagStatus status={detailWarehouse?.status as CONFIG_STATUS} />
								</span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<span>Tổng nhà cung cấp:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailWarehouse?.countCustomer}</span>
						</td>
						<td rowSpan={3} className={styles.description}>
							<span>Ghi chú:</span>
							<span style={{marginLeft: '6px'}}>{detailWarehouse?.description || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Tổng quy cách:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailWarehouse?.countSpec}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Tổng loại hàng:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{detailWarehouse?.countProductType}</span>
						</td>
					</tr>
				</table>
			</div>
			<div className={clsx('mt', styles.header_btn)}>
				<TabNavLink
					query='_type'
					listHref={[
						{
							pathname: router.pathname,
							query: null,
							title: 'Danh sách kho con',
						},
						{
							pathname: router.pathname,
							query: 'map',
							title: 'Sơ đồ kho hàng',
						},
						{
							pathname: router.pathname,
							query: 'history',
							title: 'Lịch sử kho hàng',
						},
					]}
				/>

				<Button maxContent p_12_24 rounded_2 edit href={`/kho-hang/so-do/chinh-sua?_id=${_id}`}>
					Chỉnh sửa sơ đồ
				</Button>
			</div>
			<div className={'mt'}>
				{!_type && <TableListStorage />}
				{_type == 'map' && <TableMapStorage />}
				{_type == 'history' && <TableHistoryStorage />}
			</div>

			<Dialog
				danger={detailWarehouse?.status == CONFIG_STATUS.HOAT_DONG}
				green={detailWarehouse?.status == CONFIG_STATUS.BI_KHOA}
				open={openChangeStatus}
				onClose={() => setOpenChangeStatus(false)}
				title={detailWarehouse?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa kho hàng' : 'Mở khóa kho hàng'}
				note={
					detailWarehouse?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa kho hàng này?'
						: 'Bạn có chắc chắn muốn mở khóa kho hàng này?'
				}
				onSubmit={funcChangeStatusWarehouse.mutate}
			/>
		</div>
	);
}

export default DetailWarehouse;
