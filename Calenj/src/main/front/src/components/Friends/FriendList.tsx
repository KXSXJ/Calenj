import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios, {AxiosResponse, AxiosError} from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {stateFilter} from '../../stateFunc/actionFun'
import {ListView, MiniText} from '../../style/FormStyle'


interface FriendList {
    friendId: string;
    nickName: string;
    chattingRoomId: number;
    friendAddDate: string;
}

export const QUERY_FRIEND_LIST_KEY: string = 'friendList'

const FriendList: React.FC = () => {
    //그룹 목록 불러오기
    const getFriendList = async (): Promise<FriendList[] | null> => {
        try {
            const response = await axios.post('/api/getFriendList');
            console.log('친구 목록을 불러옵니다.');
            const data = response.data as FriendList[];
            const dataSort = data.sort((a, b) => {
                return (Number(b.friendAddDate) - Number(a.friendAddDate));
            })
            return dataSort;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            if (axiosError.response?.status) {
                console.log(axiosError.response.status);
                stateFilter((axiosError.response.status).toString());
            }
            return null;
        }
    }

    const friendListState = useQuery<FriendList[] | null, Error>({
        queryKey: [QUERY_FRIEND_LIST_KEY],
        queryFn: getFriendList, //HTTP 요청함수 (Promise를 반환하는 함수)
    });

    const addFriend = async () => {
        axios.post('/api/requestFriend', null, {
            params: {
                otherUserId: "zodls1128@gmail.com"
            },
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }) // 객체의 속성명을 'id'로 설정;
            .then(() => window.alert('친구 요청이 성공적으로 전송되었습니다.'))
            .catch((error) => {
                window.alert('친구 요청이 모종의 이유로 취소되었습니다.');
                console.log(error.response.status);
            })
    }

    return (
        <div>
            <button onClick={() => addFriend()}>친구 추가</button>
            {friendListState.isLoading && <div>Loading...</div>}
            {friendListState.data && (
                <div>
                    <h2>Friend List</h2>
                    <ul>
                        {friendListState.data.map((friends) => (
                            <ListView key={friends.friendId}>
                                {friends.nickName}
                            </ListView>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
export default FriendList;