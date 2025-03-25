import {CONFIG_STATUS} from '~/constants/config/enum';
import axiosClient from '.';

const commonServices = {
	listProvince: (
		data: {
			keyword: string;
			status: CONFIG_STATUS | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Province/get-list-province`, data, {
			cancelToken: tokenAxios,
		});
	},
	listDistrict: (
		data: {
			keyword: string;
			status: CONFIG_STATUS | null;
			idParent: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Province/get-list-district`, data, {
			cancelToken: tokenAxios,
		});
	},
	listTown: (
		data: {
			keyword: string;
			status: CONFIG_STATUS | null;
			idParent: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Province/get-list-town`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default commonServices;
