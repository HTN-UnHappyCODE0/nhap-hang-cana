import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageStatisticsByDay from '~/components/pages/thong-ke-san-luong/MainPageStatisticsByDay';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Danh sách thống kê sản lượng</title>
				<meta name='description' content='Danh sách thống kê sản lượng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageStatisticsByDay />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý thống kê sản lượng'>{Page}</BaseLayout>;
};
