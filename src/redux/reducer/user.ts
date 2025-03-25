import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface IUser {
	uuid: string;
	userName: string;
	userUuid: string | null;
	avatar: string | null;
	fullname: string | null;
	regencyCode: number | null;
	companyUuid: string | null;
}

export interface UserState {
	infoUser: IUser | null;
}

const initialState: UserState = {
	infoUser: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setInfoUser: (state, action: PayloadAction<IUser | null>) => {
			state.infoUser = action?.payload;
		},
	},
});

export const {setInfoUser} = userSlice.actions;
export default userSlice.reducer;
