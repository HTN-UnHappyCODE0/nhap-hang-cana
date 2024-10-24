import Head from 'next/head';
import {Fragment, ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainPageProfile from '~/components/pages/profile/MainPageProfile/MainPageProfile';

export default function Page() {
	return (
		<Fragment>
			<Head>
				<title>Thông tin cá nhân</title>
				<meta name='description' content='Thông tin cá nhân' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainPageProfile />
			</WrapperContainer>
		</Fragment>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thông tin cá nhân'>{Page}</BaseLayout>;
};
