import React, {useEffect, useState} from 'react';

import {PropsFormLogin} from './interfaces';
import styles from './FormLogin.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import {ShieldSecurity, User} from 'iconsax-react';
import Link from 'next/link';
import {PATH} from '~/constants/config';
import Button from '~/components/common/Button';
import SwitchButton from '~/components/common/SwitchButton';
import {useRouter} from 'next/router';
import {useMutation} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import authServices from '~/services/authServices';
import Loading from '~/components/common/Loading';
import {useSelector} from 'react-redux';
import {RootState, store} from '~/redux/store';
import {setDataLoginStorage, setStateLogin, setToken} from '~/redux/reducer/auth';
import {setInfoUser} from '~/redux/reducer/user';
import {setRememberPassword} from '~/redux/reducer/site';
import md5 from 'md5';
import {TYPE_LOGIN} from '~/constants/config/enum';

function FormLogin({}: PropsFormLogin) {
	const router = useRouter();

	const {ip, isRememberPassword} = useSelector((state: RootState) => state.site);
	const {dataLoginStorage} = useSelector((state: RootState) => state.auth);

	const [form, setForm] = useState<{username: string; password: string}>({username: '', password: ''});

	useEffect(() => {
		if (isRememberPassword) {
			setForm({
				username: dataLoginStorage?.usernameStorage || '',
				password: dataLoginStorage?.passwordStorage || '',
			});
		} else {
			setForm({
				username: '',
				password: '',
			});
		}
	}, []);

	const login = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Đăng nhập thành công!',
				http: authServices.login({
					username: form.username,
					password: md5(form.password),
					ip: ip,
					address: '',
					type: TYPE_LOGIN.NHAP_HANG,
				}),
			}),
		onSuccess(data) {
			if (data) {
				store.dispatch(setToken(data.token));
				store.dispatch(
					setInfoUser({
						userName: data.userName,
						uuid: data.uuid,
						avatar: data.avatar,
						fullname: data.fullname,
						regencyCode: data.regencyCode,
						userUuid: data.userUuid,
						companyUuid: data.companyUuid,
					})
				);
				store.dispatch(setStateLogin(true));
				store.dispatch(
					setDataLoginStorage({
						usernameStorage: form.username,
						passwordStorage: form.password,
					})
				);

				router.replace(PATH.Home, undefined, {scroll: false});
			}
		},
	});

	const handleSubmit = () => {
		if (isRememberPassword) {
			store.dispatch(
				setDataLoginStorage({
					usernameStorage: form.username,
					passwordStorage: form.password,
				})
			);
		} else {
			store.dispatch(setDataLoginStorage(null));
		}

		login.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={login.isLoading} />
			<h4 className={styles.title}>Đăng nhập</h4>
			<p className={styles.text}>Chào mừng bạn đến với hệ thống quản trị nhập hàng Thái Hưng</p>
			<div className={styles.form}>
				<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
					<Input
						type='text'
						name='username'
						value={form?.username}
						placeholder='Tài khoản'
						onClean
						isRequired
						icon={<User size='20' variant='Bold' />}
						label={
							<span>
								Tài khoản <span style={{color: 'red'}}>*</span>
							</span>
						}
					/>
					<Input
						type='password'
						name='password'
						value={form?.password}
						placeholder='Mật khẩu'
						onClean
						isRequired
						icon={<ShieldSecurity size='20' variant='Bold' />}
						label={
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<span>
									Mật khẩu <span style={{color: 'red'}}>*</span>
								</span>
							</div>
						}
					/>

					<div className={styles.list_action}>
						<div className={styles.rememberLogin}>
							<SwitchButton
								name='isRememberPassword'
								value={isRememberPassword}
								onChange={() => store.dispatch(setRememberPassword(!isRememberPassword))}
							/>
							<p className={styles.des}>Ghi nhớ đăng nhập</p>
						</div>
						<Link
							href={PATH.ForgotPassword}
							style={{
								color: '#2367ED',
								fontSize: '14px',
								textDecoration: 'underline',
							}}
						>
							Quên mật khẩu?
						</Link>
					</div>

					<div className={styles.btn}>
						<FormContext.Consumer>
							{({isDone}) => (
								<Button primary bold rounded_8 disable={!isDone}>
									Đăng nhập
								</Button>
							)}
						</FormContext.Consumer>
					</div>
				</Form>
			</div>
		</div>
	);
}

export default FormLogin;
