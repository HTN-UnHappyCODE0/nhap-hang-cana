import React, {useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {IDetailStorage, PropsDetailStorage} from './interfaces';
import styles from './DetailStorage.module.scss';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import {IoArrowBackOutline} from 'react-icons/io5';
import GridColumn from '~/components/layouts/GridColumn';
import DetailBox from '~/components/common/DetailBox';
import TabNavLink from '~/components/common/TabNavLink';
import {useRouter} from 'next/router';
import TableCustomer from './components/TableCustommer';
import TableHistoryStorage from './components/TableHistoryStorage';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_STATUS, QUERY_KEY, TYPE_RULER} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Moment from 'react-moment';
import Popup from '~/components/common/Popup';
import TagStatus from '~/components/common/TagStatus';
import storageServices from '~/services/storageServices';
import TableHistoryInventory from './components/TableHistoryInventory';
import FormCreateInventory from './components/FormCreateInventory';
import {PiSealWarningFill} from 'react-icons/pi';
import {convertWeight, formatDrynessAvg} from '~/common/funcs/optionConvert';
import Button from '~/components/common/Button';
import {ShieldTick} from 'iconsax-react';
import {LuPencil} from 'react-icons/lu';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';
import Loading from '~/components/common/Loading';
import Dialog from '~/components/common/Dialog';
import FormUpdateStorage from '../../FormUpdateStorage';
import Tippy from '@tippyjs/react';

function DetailStorage({}: PropsDetailStorage) {
	const router = useRouter();

	const queryClient = useQueryClient();
	const {_id, _type, _action} = router.query;

	const [openRule, setOpenRule] = useState<boolean>(false);
	const [totalCustomer, setTotalCustomer] = useState<number>(0);
	const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);
	const [openCreateInventory, setOpenCreateInventory] = useState<boolean>(false);

	const {data: detailStorage} = useQuery<IDetailStorage>([QUERY_KEY.chi_tiet_bai, _id], {
		queryFn: () =>
			httpRequest({
				http: storageServices.detailStorage({
					uuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	const funcChangeStatusStorage = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: detailStorage?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa kho hàng thành công!' : 'Mở khóa kho hàng thành công!',
				http: storageServices.changeStatusStorage({
					uuid: detailStorage?.uuid!,
					status: detailStorage?.status! == CONFIG_STATUS.HOAT_DONG ? CONFIG_STATUS.BI_KHOA : CONFIG_STATUS.HOAT_DONG,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setOpenChangeStatus(false);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_bai, _id]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatusStorage.isLoading} />
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
					<p>Chi tiết kho {detailStorage?.name}</p>
				</Link>
				<div className={styles.list_btn}>
					<Button
						rounded_2
						w_fit
						light_outline
						p_8_16
						bold
						icon={
							detailStorage?.status == CONFIG_STATUS.HOAT_DONG ? (
								<HiOutlineLockClosed color='#23262F' fontSize={16} fontWeight={600} />
							) : (
								<HiOutlineLockOpen color='#23262F' fontSize={16} fontWeight={600} />
							)
						}
						onClick={() => setOpenChangeStatus(true)}
					>
						{detailStorage?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa' : 'Mở khóa'}
					</Button>
					<Button
						rounded_2
						w_fit
						light_outline
						p_8_16
						bold
						icon={<LuPencil color='#23262F' fontSize={16} fontWeight={600} />}
						onClick={() =>
							router.replace(
								{
									pathname: router.pathname,
									query: {
										...router.query,
										_action: 'update-storage',
										_uuidStorage: detailStorage?.uuid,
									},
								},
								undefined,
								{shallow: true, scroll: false}
							)
						}
					>
						Chỉnh sửa
					</Button>
					<Button
						rounded_2
						w_fit
						primary
						p_8_16
						bold
						icon={<ShieldTick color='#fff' size={18} fontWeight={500} />}
						onClick={() => setOpenCreateInventory(true)}
					>
						Kiểm kê
					</Button>
				</div>
			</div>
			<div className={'mt'}>
				<GridColumn col_4>
					<DetailBox
						name={'Tổng khối lượng quy khô'}
						value={convertWeight(detailStorage?.totalAmountBdmt || 0)}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<p style={{marginTop: 2}}>
										Chuẩn: <span>{convertWeight(detailStorage?.amountBdmt!)}</span>
									</p>
									<p style={{marginTop: 2}}>
										Tạm tính: <span>{convertWeight(detailStorage?.amountBdmtDemo!)}</span>
									</p>
								</div>
							</div>
						}
					/>
					<DetailBox
						name={'Khối lượng nhập'}
						value={convertWeight(detailStorage?.totalAmountIn || 0)}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<p>
										Từ nhà cung cấp: <span>{convertWeight(detailStorage?.amountIn!)}</span>
									</p>
									<p style={{marginTop: 2}}>
										Từ kho: <span>{convertWeight(detailStorage?.amountChangeIn!)}</span>
									</p>
								</div>
							</div>
						}
					/>
					<DetailBox
						name={'Khối lượng xuất'}
						value={convertWeight(detailStorage?.totalAmountOut || 0)}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<p>
										Khách hàng xuất: <span>{convertWeight(detailStorage?.amountOut!)}</span>
									</p>
									<p style={{marginTop: 2}}>
										Xuất kho: <span>{convertWeight(detailStorage?.amountChangeOut!)}</span>
									</p>
								</div>
							</div>
						}
					/>
					<DetailBox
						name={'Độ khô trung bình'}
						value={detailStorage?.drynessAvg!?.toFixed(2)}
						action={
							<div className={styles.action}>
								<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
								<div className={styles.note}>
									<span>Dữ liệu lấy theo độ khô chuẩn</span>
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
							<span style={{marginLeft: '6px'}}>{detailStorage?.code || '---'}</span>
						</td>
						<td>
							<span>Thời gian tạo:</span>
							<span style={{marginLeft: '6px'}}>
								{detailStorage?.created ? <Moment date={detailStorage?.created} format='HH:mm, DD/MM/YYYY' /> : '---'}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Tên kho hàng: </span>
							<span style={{marginLeft: '6px'}}>{detailStorage?.name || '---'}</span>
						</td>
						<td>
							<div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
								<span>Trạng thái:</span>
								<span>
									<TagStatus status={detailStorage?.status as CONFIG_STATUS} />
								</span>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<span>Thuộc kho to: </span>
							<span style={{marginLeft: '6px'}}>{detailStorage?.warehouseUu?.name || '---'}</span>
						</td>
						<td>
							<span>Chỉnh sửa gần nhất:</span>
							<span style={{marginLeft: '6px'}}>
								{detailStorage?.updatedTime ? (
									<Moment date={detailStorage?.updatedTime} format='HH:mm, DD/MM/YYYY' />
								) : (
									'---'
								)}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Tổng nhà cung cấp:</span>
							<span style={{marginLeft: '6px', color: '#2A85FF'}}>{totalCustomer}</span>
						</td>
						<td rowSpan={3} className={styles.description}>
							<span>Mô tả:</span>
							<span style={{marginLeft: '6px'}}>{detailStorage?.description || '---'}</span>
						</td>
					</tr>
					<tr>
						<td>
							<span>Loại hàng:</span>
							<span style={{marginLeft: '6px'}}>{detailStorage?.productUu?.name}</span>
						</td>
					</tr>
					<tr>
						<td>
							<div className={styles.flex}>
								<div>
									<span>Quy cách:</span>
									<span style={{marginLeft: '6px'}}>{detailStorage?.specificationsUu?.name}</span>
								</div>
								<TippyHeadless
									maxWidth={'100%'}
									interactive
									onClickOutside={() => setOpenRule(false)}
									visible={openRule}
									placement='top'
									render={(attrs) => (
										<div className={styles.main_rule}>
											{detailStorage?.listSpecValue?.map((v, i) => (
												<div key={i} className={styles.item}>
													<p>{v?.criteriaUu?.title}</p>
													<p style={{color: '#2D74FF', fontWeight: 600}}>
														{/* <span style={{marginRight: 4}}>
															{v?.criteriaUu?.ruler == TYPE_RULER.NHO_HON ? '<' : '>'}
														</span> */}
														{v?.value?.toFixed(2)}%
													</p>
												</div>
											))}
										</div>
									)}
								>
									<Tippy content='Xem tiêu chí'>
										<div className={styles.detail_rule} onClick={() => setOpenRule(!openRule)}>
											<PiSealWarningFill size={20} color='#2D74FF' className={styles.icon_warn} />
										</div>
									</Tippy>
								</TippyHeadless>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div className={'mt'}>
				<TabNavLink
					query='_type'
					listHref={[
						{
							pathname: router.pathname,
							query: null,
							title: 'Lịch sử nhà cung cấp',
						},
						{
							pathname: router.pathname,
							query: 'history',
							title: 'Lịch sử kho hàng',
						},
						{
							pathname: router.pathname,
							query: 'kiem-ke',
							title: 'Lịch sử kiểm kê',
						},
					]}
				/>
			</div>
			<div className={'mt'}>
				{!_type && <TableCustomer setTotalCustomer={setTotalCustomer} />}
				{_type == 'history' && <TableHistoryStorage />}
				{_type == 'kiem-ke' && <TableHistoryInventory />}
			</div>

			<Dialog
				danger={detailStorage?.status == CONFIG_STATUS.HOAT_DONG}
				green={detailStorage?.status == CONFIG_STATUS.BI_KHOA}
				open={openChangeStatus}
				onClose={() => setOpenChangeStatus(false)}
				title={detailStorage?.status == CONFIG_STATUS.HOAT_DONG ? 'Khóa kho hàng' : 'Mở khóa kho hàng'}
				note={
					detailStorage?.status == CONFIG_STATUS.HOAT_DONG
						? 'Bạn có chắc chắn muốn khóa kho hàng này?'
						: 'Bạn có chắc chắn muốn mở khóa kho hàng này?'
				}
				onSubmit={funcChangeStatusStorage.mutate}
			/>

			<Popup
				open={_action == 'update-storage'}
				onClose={() => {
					const {_action, _uuidStorage, ...rest} = router.query;
					router.replace(
						{
							pathname: router.pathname,
							query: {
								...rest,
							},
						},
						undefined,
						{shallow: true, scroll: false}
					);
				}}
			>
				<FormUpdateStorage
					onClose={() => {
						const {_action, _uuidStorage, ...rest} = router.query;
						router.replace(
							{
								pathname: router.pathname,
								query: {
									...rest,
								},
							},
							undefined,
							{shallow: true, scroll: false}
						);
					}}
				/>
			</Popup>

			<Popup open={openCreateInventory} onClose={() => setOpenCreateInventory(false)}>
				<FormCreateInventory nameStorage={detailStorage?.name} onClose={() => setOpenCreateInventory(false)} />
			</Popup>
		</div>
	);
}

export default DetailStorage;
