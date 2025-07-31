import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageStatisticsBySpec from '~/components/pages/thong-ke-chat-luong-theo-quy-cach/MainPageStatisticsBySpec';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Danh sách thống kê chất lượng theo quy cách</title>
				<meta name='description' content='Danh sách thống kê chất lượng theo quy cách' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageStatisticsBySpec />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý thống kê chất lượng theo quy cách'>{Page}</BaseLayout>;
};
