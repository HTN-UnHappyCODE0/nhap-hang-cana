import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageDetailPartner from '~/components/pages/nha-cung-cap/PageDetailPartner';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Chi tiết công ty</title>
				<meta name='description' content='Chi tiết công ty' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer>
				<PageDetailPartner />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Quản lý công ty'>
			{Page}
		</BaseLayout>
	);
};
