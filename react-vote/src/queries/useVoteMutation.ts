import { useMutation } from '@tanstack/react-query';
import { userAPI } from '../api/request';
import { useNavigate } from 'react-router-dom';

export const useVoteTeamMutation = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('accessToken');

	const { mutate } = useMutation({
		mutationFn: async (teamId: number) => {
			return await userAPI.voteTeam(teamId);
		},
		onSuccess: () => {
			alert('투표가 성공적으로 완료되었습니다!');
		},
		onError: (error: any) => {
			if (!token) {
				alert('로그인이 필요합니다.');
				navigate('/login');
			} else {
				alert(`중복 투표는 불가능합니다.`);
			}
		},
	});

	return {
		teamVote: mutate,
	};
};

export const useVoteMemberMutation = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('accessToken');

	const { mutate } = useMutation({
		mutationFn: async (leaderId: number) => {
			return await userAPI.voteLeader(leaderId);
		},
		onSuccess: () => {
			alert('투표가 성공적으로 완료되었습니다!');
		},
		onError: (error: any) => {
			if (!token) {
				alert('로그인이 필요합니다.');
				navigate('/login');
			} else {
				alert(`중복 투표는 불가능합니다.`);
			}
		},
	});

	return {
		memberVote: mutate,
	};
};
