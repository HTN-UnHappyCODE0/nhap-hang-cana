import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageStatisticsByDay from '~/components/pages/thong-ke-theo-ngay/MainPageStatisticsByDay';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Danh sách thống kê theo ngày</title>
				<meta name='description' content='Danh sách thống kê theo ngày' />
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
	return <BaseLayout title='Quản lý thống kê theo ngày'>{Page}</BaseLayout>;
};
