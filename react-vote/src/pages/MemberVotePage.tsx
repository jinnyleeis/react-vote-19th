import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Dropdown } from '../components/Dropdown';
import MemberLists from '../components/MemberLists';
import { useGetLeaders } from '../queries/useGetLeader';
import { useVoteMemberMutation } from '../queries/useVoteMutation';

interface ReadLeaderResponse {
	userId: number;
	name: string;
	part: string; //enum인데 어떻게 처리할지 고민
	team: string;
}

function MemberVotePage() {
	const { memberVote } = useVoteMemberMutation();
	const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

	const handleVote = () => {
		if (selectedMemberId !== null) {
			memberVote(selectedMemberId);
			console.log(selectedMemberId);
		} else {
			alert('투표할 멤버를 선택해주세요.');
		}
	};

	const [isFront, setIsFront] = useState('FRONT');
	const [showingLists, setShowingLists] = useState<ReadLeaderResponse[]>([]);

	const {
		leaders: frontendLists,
		isLoading: isLoadingFrontend,
		error: errorFrontend,
	} = useGetLeaders('front');
	const {
		leaders: backendLists,
		isLoading: isLoadingBackend,
		error: errorBackend,
	} = useGetLeaders('back');

	useEffect(() => {
		if (isFront === 'FRONT') {
			setShowingLists(frontendLists || []);
		} else {
			setShowingLists(backendLists || []);
		}
	}, [isFront, frontendLists, backendLists]);

	const togglePart = () => {
		setIsFront((prev) => (prev === 'FRONT' ? 'BACK' : 'FRONT'));
	};

	if (isLoadingFrontend || isLoadingBackend) return <div>Loading...</div>;
	if (errorFrontend || errorBackend) return <div>Error fetching leaders</div>;

  const handleMemberClick = (userId: number) => {
		setSelectedMemberId(userId);
	};

	console.log(showingLists);

	return (
		<MemberVotePageContainer>
			<Title>
				Who do you want to vote for <br />
				<span onClick={togglePart}>{isFront}</span> Leader?
			</Title>
			<MemberListsWrapper>
				<ColumnWrapper>
					{showingLists.slice(0, 5).map((member) => (
						<MemberLists
							key={member.userId}
							member={member}
							onClick={() => handleMemberClick(member.userId)}
							isSelected={selectedMemberId === member.userId}
						/>
					))}
				</ColumnWrapper>
				<ColumnWrapper>
					{showingLists.slice(5).map((member) => (
						<MemberLists
							key={member.userId}
							member={member}
							onClick={() => handleMemberClick(member.userId)}
							isSelected={selectedMemberId === member.userId}
						/>
					))}
				</ColumnWrapper>
			</MemberListsWrapper>
			<VoteBtn onClick={handleVote}>selected !</VoteBtn>
		</MemberVotePageContainer>
	);
}

export default MemberVotePage;

const MemberVotePageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
`;

const Title = styled.h2`
	margin-bottom: 3rem;
`;
const MemberListsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 2rem;
`;

const ColumnWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const VoteBtn = styled.div`
	width: 15vw;
	height: 5.5vh;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 1rem;

	//뒤에 불투명 배경 요소
	background-color: transparent;
	border: 0.1rem solid rgba(255, 255, 255, 0.3);
	border-radius: 10px;
	background-image: linear-gradient(
			rgba(255, 255, 255, 0.05),
			rgba(255, 255, 255, 0.12)
		),
		linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
	background-clip: border-box, content-box;
	backdrop-filter: blur(30px);

	color: white;
	font-size: 1.8rem;
	font-weight: 550;
`;
