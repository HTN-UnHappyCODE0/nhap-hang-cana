import React, {Fragment} from 'react';

import {IDataTableHistoryStorage, PropsTableHistoryStorage} from './interfaces';
import styles from './TableHistoryStorage.module.scss';
import {useRouter} from 'next/router';
import DataWrapper from '~/components/common/DataWrapper';
import Moment from 'react-moment';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import {useQuery} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_TYPE_FIND, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import storageServices from '~/services/storageServices';
import {convertWeight} from '~/common/funcs/optionConvert';

function TableHistoryStorage({}: PropsTableHistoryStorage) {
	const router = useRouter();

	const {_id, _page, _pageSize, _keyword, _dateFrom, _dateTo} = router.query;

	const listHistoryStorage = useQuery([QUERY_KEY.table_lich_su_bai, _page, _pageSize, _keyword, _dateFrom, _dateTo, _id], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: storageServices.historyStorageInOut({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 200,
					keyword: (_keyword as string) || '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.IS_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					status: null,
					storageUuid: _id as string,
					timeEnd: _dateTo ? (_dateTo as string) : null,
					timeStart: _dateFrom ? (_dateFrom as string) : null,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<Fragment>
			<div className={styles.header}>
				<div className={styles.main_search}>
					{/* <div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm' />
					</div> */}

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' />
					</div>
				</div>
			</div>
			<div className='mt'>
				<DataWrapper
					data={listHistoryStorage?.data?.items || []}
					loading={listHistoryStorage.isLoading}
					noti={<Noti disableButton />}
				>
					<Table
						data={listHistoryStorage?.data?.items || []}
						column={[
							{
								title: 'STT',
								render: (data: IDataTableHistoryStorage, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Thời gian',
								render: (data: IDataTableHistoryStorage) =>
									data?.dayUpdate ? <Moment date={data?.dayUpdate} format='DD/MM/YYYY' /> : '---',
							},

							{
								title: 'Tổng lượng quy khô nhập (Tấn)',
								render: (data: IDataTableHistoryStorage) => (
									<span style={{color: '#2D74FF'}}>{convertWeight(data?.amountIn)}</span>
								),
							},
							{
								title: 'Tổng lượng quy khô xuất (Tấn)',
								render: (data: IDataTableHistoryStorage) => (
									<span style={{color: '#2D74FF'}}>{convertWeight(data?.amountOut)}</span>
								),
							},
							{
								title: 'Tổng lượng quy khô chuyển kho (Tấn)',
								render: (data: IDataTableHistoryStorage) => (
									<span style={{color: '#2D74FF'}}>
										{convertWeight(Number(data.amountChangeIn) - Number(data?.amountChangeOut))}
									</span>
								),
							},
							// {
							// 	title: 'Tổng hàng trong kho',
							// 	render: (data: IDataTableHistoryStorage) => (
							// 		<span style={{color: '#2D74FF'}}>{convertWeight(data?.totalAmount)}</span>
							// 	),
							// },
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listHistoryStorage?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 200}
					dependencies={[_pageSize, _keyword, _dateFrom, _dateTo, _id]}
				/>
			</div>
		</Fragment>
	);
}

export default TableHistoryStorage;
