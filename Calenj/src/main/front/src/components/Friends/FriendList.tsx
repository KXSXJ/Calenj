import axios, {AxiosResponse, AxiosError} from 'axios';
import {useEffect, useState} from 'react';
import {UserListView, MiniText} from '../../shared/ui/SharedStyled'
import {useFetchFriendsList} from "../../entities/reactQuery/model/queryModel";






const FriendList: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    //그룹 목록 불러오기

    const friendListState = useFetchFriendsList();
    const addFriend = async () => {
        axios.post('/api/requestFriend', {friendUserId: inputValue}) // 객체의 속성명을 'id'로 설정;
            .then(() => window.alert('친구 요청이 성공적으로 전송되었습니다.'))
            .catch((error) => {
                window.alert('존재하지 않는 아이디 같아요.');
                console.log(error.response.status);
            })
    }
    return (
        <div>
            <div>
                <input type="text" value={inputValue} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setInputValue(e.target.value)}/>
                <button onClick={() => addFriend()}>친구 추가</button>
            </div>
            {friendListState.isLoading && <div>Loading...</div>}
            {friendListState.data && (
                <div>
                    <h2>Friend List</h2>
                    <ul>
                        {friendListState.data.map((friends) => (
                            <UserListView key={friends.friendId}>
                                {friends.nickName}
                            </UserListView>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
export default FriendList;