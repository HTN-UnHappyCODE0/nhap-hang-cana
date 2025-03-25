import React from 'react';
import {IdetailUser, PropsMainPageProfile} from './interfaces';
import styles from './MainPageProfile.module.scss';
import {Cake, Call, Location, Personalcard, Sms, TagUser, UserEdit, UserOctagon, UserSquare} from 'iconsax-react';
import ImageFill from '~/components/common/ImageFill';
import {HiOutlineLockClosed} from 'react-icons/hi';
import Button from '~/components/common/Button';
import {useQuery} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {RootState} from '~/redux/store';
import {GENDER, QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import userServices from '~/services/userServices';
import Moment from 'react-moment';
import {getTextAddress} from '~/common/funcs/optionConvert';
import Popup from '~/components/common/Popup';
import FormChangePassword from '../FormChangePassword';
import {useRouter} from 'next/router';
import icons from '~/constants/images/icons';

function MainPageProfile({}: PropsMainPageProfile) {
	const router = useRouter();
	const {_action} = router.query;

	const {infoUser} = useSelector((state: RootState) => state.user);

	const {data: detaillUser} = useQuery<IdetailUser>([QUERY_KEY.chi_tiet_nhan_vien, infoUser?.userUuid], {
		queryFn: () =>
			httpRequest({
				http: userServices.detailUser({
					uuid: infoUser?.userUuid!,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!infoUser?.userUuid,
	});

	const handleClosePopup = () => {
		const {_action, ...rest} = router.query;

		router.replace(
			{
				pathname: router.pathname,
				query: {
					...rest,
				},
			},
			undefined,
			{shallow: true, scroll: false}
		);
	};

	const handleOpenChangePassword = () => {
		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					_action: 'change-password',
				},
			},
			undefined,
			{shallow: true, scroll: false}
		);
	};

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				<h4>Thông tin tài khoản</h4>
				<p>Chào mừng {detaillUser?.fullName || '---'} đến với hệ thống quản lý cân Thái Hưng</p>
			</div>
			<div className={styles.box_info}>
				<ImageFill
					src={detaillUser?.linkImage ? `${process.env.NEXT_PUBLIC_IMAGE}/${detaillUser?.linkImage}` : icons.avatarDefault}
					alt='avatar'
					className={styles.avatar}
				/>
				<div className={styles.info}>
					<div className={styles.name}>
						<h5>{detaillUser?.fullName || '---'}</h5>
					</div>
					<div className={styles.role}>{detaillUser?.regencyUu?.name || '---'}</div>
					<div className={styles.list_btn}>
						<Button
							rounded_2
							w_fit
							green
							p_8_16
							bold
							icon={<HiOutlineLockClosed color='#FFFFFF' fontSize={16} fontWeight={600} />}
							onClick={handleOpenChangePassword}
						>
							Đổi mật khẩu
						</Button>
						<Button
							rounded_2
							w_fit
							primary
							p_8_16
							bold
							icon={<UserEdit color='#FFFFFF' fontSize={16} fontWeight={600} />}
							href={`/profile/chinh-sua?_id=${detaillUser?.uuid}`}
						>
							Chỉnh sửa thông tin
						</Button>
					</div>
				</div>
			</div>
			<div className={styles.header}>
				<div className={styles.header_table}>
					<div className={styles.header_title}>Thông tin cơ bản</div>
					<div className={styles.content_table}>
						<div className={styles.item_table}>
							<p>
								<Personalcard fontSize={24} fontWeight={600} />
								Tên đăng nhập
							</p>
							<span>{infoUser?.userName || '---'}</span>
						</div>
						<div className={styles.item_table}>
							<p>
								<TagUser fontSize={24} fontWeight={600} />
								Họ và tên
							</p>
							<span>{detaillUser?.fullName || '---'}</span>
						</div>
						<div className={styles.item_table}>
							<p>
								<UserOctagon fontSize={24} fontWeight={600} />
								Giới tính
							</p>
							<span>{detaillUser?.sex === undefined ? '---' : detaillUser.sex == GENDER.NAM ? 'Nam' : 'Nữ'}</span>
						</div>
						<div className={styles.item_table}>
							<p>
								<Cake fontSize={24} fontWeight={600} />
								Ngày sinh
							</p>
							<span>
								<Moment date={detaillUser?.birthDay || '---'} format='DD/MM/YYYY' />
							</span>
						</div>
					</div>
				</div>
				<div className={styles.header_table}>
					<div className={styles.header_title}>Liên hệ</div>
					<div className={styles.content_table}>
						<div className={styles.item_table}>
							<p>
								<UserSquare fontSize={24} fontWeight={600} />
								Chức vụ
							</p>
							<span>{detaillUser?.regencyUu?.name || '---'}</span>
						</div>
						<div className={styles.item_table}>
							<p>
								<Sms fontSize={24} fontWeight={600} />
								Email
							</p>
							<span>{detaillUser?.email || '---'}</span>
						</div>
						<div className={styles.item_table}>
							<p>
								<Call fontSize={24} fontWeight={600} />
								Số điện thoại
							</p>
							<span>{detaillUser?.phoneNumber || '---'}</span>
						</div>
						<div className={styles.item_table}>
							<p>
								<Location fontSize={24} fontWeight={600} />
								Địa chỉ
							</p>
							<span>{getTextAddress(detaillUser?.detailAddress, detaillUser?.address) || '---'}</span>
						</div>
					</div>
				</div>
			</div>
			<Popup open={_action == 'change-password'} onClose={handleClosePopup}>
				<FormChangePassword onClose={handleClosePopup} />
			</Popup>
		</div>
	);
}

export default MainPageProfile;
