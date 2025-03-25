import React, {useEffect, useState} from 'react';

import {PropsDashboardWarehouse} from './interfaces';
import styles from './DashboardWarehouse.module.scss';
import clsx from 'clsx';
import {ChartSquare} from 'iconsax-react';
import ItemDashboard from './components/ItemDashboard';
import ItemInfoChart from './components/ItemInfoChart';
import ChartDashboard from './components/ChartDashboard';
import Link from 'next/link';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_PRODUCT} from '~/constants/config/enum';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import companyServices from '~/services/companyServices';
import SelectFilterOption from '../../trang-chu/SelectFilterOption';
import {set} from 'nprogress';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';

function DashboardWarehouse({
	isTotal,
	total,
	productTotal,
	qualityTotal,
	specTotal,
	dataWarehouse,
	setUuidCompany,
	setUuidTypeProduct,
}: PropsDashboardWarehouse) {
	const [arrayTypeAction, setArrayTypeAction] = useState<('product' | 'quality' | 'spec')[]>(['product', 'quality', 'spec']);

	const {infoUser} = useSelector((state: RootState) => state.user);

	const handleAction = (key: 'product' | 'quality' | 'spec') => {
		if (arrayTypeAction.some((v) => v == key)) {
			setArrayTypeAction(arrayTypeAction?.filter((x) => x != key));
		} else {
			setArrayTypeAction((prev) => [...prev, key]);
		}
	};

	const [uuidCompany, setUuidCompanyFilter] = useState<string>('');
	const [nameCompany, setNameCompanyFilter] = useState<string>('');
	const [typeProduct, setTypeProduct] = useState<number>(TYPE_PRODUCT.CONG_TY);

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

	useEffect(() => {
		if (setUuidCompany) {
			setUuidCompany(uuidCompany);
		}
		if (setUuidTypeProduct) {
			setUuidTypeProduct(typeProduct);
		}
	}, [uuidCompany, typeProduct]);

	const uuidCompanyDefault = '';
	// const uuidCompanyDefault = '622f5955-5add-4490-8868-7d9ed1fa3e72';
	useEffect(() => {
		if (uuidCompanyDefault && infoUser?.companyUuid == null) {
			setUuidCompanyFilter(uuidCompanyDefault);
			const name = listCompany?.data?.find((v: any) => v?.uuid == uuidCompanyDefault)?.name;
			setNameCompanyFilter(name);
		}
		if (uuidCompanyDefault && infoUser?.companyUuid != null) {
			setUuidCompanyFilter(infoUser?.companyUuid);
			const name = listCompany?.data?.find((v: any) => v?.uuid == infoUser?.companyUuid)?.name;
			setNameCompanyFilter(name);
		}
	}, [uuidCompanyDefault, infoUser?.companyUuid]);

	// ${nameCompany}

	return (
		<div className={clsx(styles.container, {[styles.isTotal]: isTotal})}>
			<div className={styles.top}>
				<div className={styles.head}>
					{isTotal && (
						<div className={styles.icon}>
							<ChartSquare size='28' color='#fff' variant='Bold' />
						</div>
					)}
					<h4 className={styles.title}>{isTotal ? `Tổng kho ` : dataWarehouse?.name}</h4>
				</div>

				{isTotal && infoUser?.companyUuid == null && (
					<div className={styles.filter_group}>
						<div className={styles.input_price}>
							<input
								id={`state_type_product`}
								name='state_type_product'
								type='checkbox'
								className={styles.input}
								checked={typeProduct === TYPE_PRODUCT.CONG_TY}
								onChange={(e) => setTypeProduct(e.target.checked ? TYPE_PRODUCT.CONG_TY : 0)}
							/>
							<label className={styles.label_check_box} htmlFor={`state_type_product`}>
								Chỉ hiển thị hàng công ty
							</label>
						</div>
						<div className={styles.filter}>
							<SelectFilterOption
								uuid={uuidCompany}
								setUuid={setUuidCompanyFilter}
								setName={setNameCompanyFilter}
								listData={listCompany?.data?.map((v: any) => ({
									uuid: v?.uuid,
									name: v?.name,
								}))}
								placeholder='Tất cả kv cảng xuất khẩu'
							/>
						</div>
					</div>
				)}

				{/* {!isTotal && (
					<Link href={`/kho-hang/${dataWarehouse?.uuid}`} className={styles.link}>
						Chi tiết kho hàng
					</Link>
				)} */}
			</div>
			<div className={styles.main}>
				<div className={styles.main_item}>
					<ItemDashboard
						isTotal={isTotal}
						value={isTotal ? total?.amountTotalBDMT! : dataWarehouse?.amountTotalBDMT!}
						text='Tổng khối lượng quy khô'
						background='#2D74FF'
					/>
					<ItemDashboard
						isTotal={isTotal}
						value={isTotal ? total?.amountBDMTDemo! : dataWarehouse?.amountBDMTDemo!}
						text='Khối lượng quy khô tạm tính (BDMT)'
						background='#FF6838'
					/>
					<ItemDashboard
						isTotal={isTotal}
						value={isTotal ? total?.amountBDMT! : dataWarehouse?.amountBDMT!}
						text='Khối lượng quy khô chuẩn (BDMT)'
						background='#2DA2BC'
					/>
					<ItemDashboard
						isTotal={isTotal}
						value={isTotal ? total?.amountOutBDMT! : dataWarehouse?.amountOutBDMT!}
						text='Khối lượng xuất tạm tính (BDMT)'
						background='#e93a3a'
						textColor='#e93a3a'
					/>
				</div>
				<div className={styles.main_info}>
					<div className={styles.main_chart}>
						{isTotal ? (
							<ChartDashboard
								totalValueChart={total?.amountTotalBDMT!}
								dataChart={{
									productWeight: productTotal?.map((v) => ({
										name: v?.productTypeUu?.name,
										color: v?.productTypeUu?.colorShow,
										value: v?.amountTotalBDMT,
									}))!,
									qualityWeight: qualityTotal?.map((v) => ({
										name: v?.qualityUu?.name,
										color: v?.qualityUu?.colorShow,
										value: v?.amountTotalBDMT,
									}))!,
									specWeight: specTotal?.map((v) => ({
										name: v?.specUu?.name,
										color: v?.specUu?.colorShow,
										value: v?.amountTotalBDMT,
									}))!,
								}}
								arrayTypeAction={arrayTypeAction}
							/>
						) : (
							<ChartDashboard
								totalValueChart={dataWarehouse?.amountTotalBDMT!}
								dataChart={{
									productWeight: dataWarehouse?.productWeight?.map((v) => ({
										name: v?.productTypeUu?.name,
										color: v?.productTypeUu?.colorShow,
										value: v?.amountTotalBDMT,
									}))!,
									qualityWeight: dataWarehouse?.qualityWeight?.map((v) => ({
										name: v?.qualityUu?.name,
										color: v?.qualityUu?.colorShow,
										value: v?.amountTotalBDMT,
									}))!,
									specWeight: dataWarehouse?.specWeight?.map((v) => ({
										name: v?.specUu?.name,
										color: v?.specUu?.colorShow,
										value: v?.amountTotalBDMT,
									}))!,
								}}
								arrayTypeAction={arrayTypeAction}
							/>
						)}
					</div>
					<div className={styles.main_item_info}>
						<ItemInfoChart
							text='Loại hàng'
							arrayData={
								isTotal
									? productTotal?.map((v) => ({
											name: v?.productTypeUu?.name,
											color: v?.productTypeUu?.colorShow,
											value: v?.amountTotalBDMT,
									  }))!
									: dataWarehouse?.productWeight?.map((v) => ({
											name: v?.productTypeUu?.name,
											color: v?.productTypeUu?.colorShow,
											value: v?.amountTotalBDMT,
									  }))!
							}
							keyAction='product'
							arrayTypeAction={arrayTypeAction}
							handleAction={() => handleAction('product')}
						/>
						<ItemInfoChart
							text='Quốc gia'
							arrayData={
								isTotal
									? qualityTotal?.map((v) => ({
											name: v?.qualityUu?.name,
											color: v?.qualityUu?.colorShow,
											value: v?.amountTotalBDMT,
									  }))!
									: dataWarehouse?.qualityWeight?.map((v) => ({
											name: v?.qualityUu?.name,
											color: v?.qualityUu?.colorShow,
											value: v?.amountTotalBDMT,
									  }))!
							}
							keyAction='quality'
							arrayTypeAction={arrayTypeAction}
							handleAction={() => handleAction('quality')}
						/>
						<ItemInfoChart
							text='Quy cách'
							arrayData={
								isTotal
									? specTotal?.map((v) => ({
											name: v?.specUu?.name,
											color: v?.specUu?.colorShow,
											value: v?.amountTotalBDMT,
									  }))!
									: dataWarehouse?.specWeight?.map((v) => ({
											name: v?.specUu?.name,
											color: v?.specUu?.colorShow,
											value: v?.amountTotalBDMT,
									  }))!
							}
							keyAction='spec'
							arrayTypeAction={arrayTypeAction}
							handleAction={() => handleAction('spec')}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DashboardWarehouse;
