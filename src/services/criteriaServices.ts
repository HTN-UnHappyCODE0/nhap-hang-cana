import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const criteriaServices = {
	listCriteria: (
		data: {
			page: number;
			pageSize: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			specificationUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Criteria/get-list-criteria`, data, {
			cancelToken: tokenAxios,
		});
	},
	listCriteriaSpec: (
		data: {
			page: number;
			pageSize: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			specificationUuid: string;
			qualityUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Criteria/get-list-spec-criteria`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default criteriaServices;
