import React, {useEffect, useState} from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import ChartImportCompany from '../ChartImportCompany';
import ChartStackArea from '../ChartStackArea';
import ChartStackStatisticsByDay from '../ChartStackStatisticsByDay';
import SelectFilterDate from '../SelectFilterDate';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_NAME,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_PARTNER,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {ContextPageHome} from '../context';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import {useQuery} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import commonServices from '~/services/commonServices';
import companyServices from '~/services/companyServices';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';
import partnerServices from '~/services/partnerServices';
import customerServices from '~/services/customerServices';
import FlexLayout from '~/components/layouts/FlexLayout';
import FullColumnFlex from '~/components/layouts/FlexLayout/components/FullColumnFlex';
import SelectFilterManyOption from '~/components/common/SelectFilterManyOption';
import SelectFilterManyList from '~/components/common/SelectFilterManyList';
import wareServices from '~/services/wareServices';
import SelectFilterState from '~/components/common/SelectFilterState';

function MainDashboard({}: PropsMainDashboard) {
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);

	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.LAST_7_DAYS);
	const [provinceUuid, setProvinceUuid] = useState<string[]>([]);
	const [productUuid, setProductUuid] = useState<string>('');

	const [listCompanyUuid, setListCompanyUuid] = useState<string[]>([]);
	const [listUserPurchasingUuid, setListUserPurchasingUuid] = useState<string[]>([]);
	const [listPartnerUuid, setListPartnerUuid] = useState<string[]>([]);
	const [listUserOwnerUuid, setListUserOwnerUuid] = useState<string[]>([]);
	const [listCustomerUuid, setListCustomerUuid] = useState<string[]>([]);

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

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
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
		onSuccess(data) {
			if (data) {
				setProductUuid(data[0]?.uuid);
			}
		},
		select(data) {
			return data;
		},
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

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap, listCompanyUuid, listUserPurchasingUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: partnerServices.listPartner({
					pageSize: 50,
					page: 1,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					isPaging: CONFIG_PAGING.NO_PAGING,
					userUuid: '',
					provinceId: '',
					type: TYPE_PARTNER.NCC,
					listCompanyUuid: listCompanyUuid,
					listUserUuid: listUserPurchasingUuid,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listUserMarket = useQuery([QUERY_KEY.dropdown_nhan_vien_thi_truong, listUserPurchasingUuid], {
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
					parentUuid: '',
					listParentUuid: listUserPurchasingUuid,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang_nhap, listCompanyUuid, listPartnerUuid, listUserOwnerUuid], {
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
					listCompanyUuid: listCompanyUuid,
					listPartnerUUid: listPartnerUuid,
					listUserUuid: listUserOwnerUuid,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listProvince = useQuery([QUERY_KEY.dropdown_tinh_thanh_pho], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listProvince({
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});

	useEffect(() => {
		if (listCompanyUuid) {
			setListCustomerUuid([]);
		}
		if (listPartnerUuid) {
			setListCustomerUuid([]);
		}
	}, [listCompanyUuid, listPartnerUuid]);

	useEffect(() => {
		if (listCompanyUuid) {
			setListPartnerUuid([]);
		}
	}, [listCompanyUuid]);

	useEffect(() => {
		if (listUserOwnerUuid) {
			setListCustomerUuid([]);
		}
	}, [listUserOwnerUuid]);

	useEffect(() => {
		if (listUserPurchasingUuid) {
			setListPartnerUuid([]);
			setListUserOwnerUuid([]);
		}
	}, [listUserPurchasingUuid]);

	// useEffect(() => {
	// 	if (listProductType?.data?.length > 0) {
	// 		setProductUuid(listProductType.data[listProductType.data.length - 1].uuid);
	// 	}
	// }, [listProductType.data]);

	return (
		<FlexLayout>
			<div className={styles.head}>
				<div className={styles.main_filter}>
					<SelectFilterManyOption
						splitCondition={(v) => v?.type === 0}
						splitGroupNames={['Kho xuất khẩu', 'Kho trung chuyển']}
						selectedIds={listCompanyUuid}
						setSelectedIds={setListCompanyUuid}
						listData={listCompany?.data}
						name='Kho'
					/>

					<SelectFilterManyOption
						selectedIds={listUserPurchasingUuid}
						setSelectedIds={setListUserPurchasingUuid}
						listData={listUserPurchasing?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						name='QLNH'
						// content
						// selectedIdsContent={listUserOwnerUuid}
						// setSelectedIdsContent={setListUserOwnerUuid}
						// listDataContent={listUserMarket?.data?.map((v: any) => ({
						// 	uuid: v?.uuid,
						// 	name: v?.fullName,
						// }))}
						// nameContent='Người quản lý nhân viên thị trường'
					/>

					<SelectFilterMany
						selectedIds={listUserOwnerUuid}
						setSelectedIds={setListUserOwnerUuid}
						listData={listUserMarket?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.fullName,
						}))}
						name='NVTT'
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
						selectedIds={listCustomerUuid}
						setSelectedIds={setListCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='NCC'
					/>
					<SelectFilterMany
						selectedIds={provinceUuid}
						setSelectedIds={setProvinceUuid}
						listData={listProvince?.data?.map((v: any) => ({
							uuid: v?.matp,
							name: v?.name,
						}))}
						name='Tỉnh'
					/>
					<SelectFilterState
						isShowAll={false}
						uuid={productUuid}
						setUuid={setProductUuid}
						listData={listProductType?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Loại hàng'
					/>

					<SelectFilterDate date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />
				</div>
			</div>

			<FullColumnFlex>
				<ContextPageHome.Provider
					value={{
						date: date,
						provinceUuid: provinceUuid,
						listCompanyUuid: listCompanyUuid,
						listUserPurchasingUuid: listUserPurchasingUuid,
						listPartnerUuid: listPartnerUuid,
						listUserOwnerUuid: listUserOwnerUuid,
						listCustomerUuid: listCustomerUuid,
						productUuid: productUuid,
					}}
				>
					<ChartImportCompany />
					<ChartStackArea />
					<ChartStackStatisticsByDay />
				</ContextPageHome.Provider>
			</FullColumnFlex>
		</FlexLayout>
	);
}

export default MainDashboard;
