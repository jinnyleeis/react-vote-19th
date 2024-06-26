import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/request';
import { useNavigate } from 'react-router-dom';

export const useLogoutMutation = () => {
	const navigate = useNavigate();

	const token = localStorage.getItem('accessToken');

	const { mutate, error } = useMutation({
		mutationFn: async () => {
			if (token) {
				await authAPI.logout(token);
			}
		},
		onSuccess: () => {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			alert('로그아웃 되었습니다.');
		},
		onError: (error: any) => {
			console.error('Logout error:', error);
			alert('로그아웃 중 오류가 발생했습니다.');
		},
	});

	return {
		logout: mutate,
		error,
	};
};
