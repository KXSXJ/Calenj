import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import MakeGroup from './MakeGroup';
import axios ,{AxiosResponse, AxiosError}from 'axios';
import {useEffect, useState} from 'react';
import {redirect} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {stateFilter} from '../../stateFunc/actionFun'
import { off } from 'process';
import { object, string } from 'yup';


interface GroupList {
    groupId: number|string;
    groupTitle: string;
}
interface cookieState{
    cookie:boolean;
}

interface error{
    message : string;
}



export const QUERY_GROUP_LIST_KEY: string = 'groupList'

const GroupList: React.FC<cookieState> = ({cookie}) => {
    const [showMakeGroup, setShowMakeGroup] = useState<boolean>(false);
    const navigate = useNavigate();
    const [loading,setLoading] = useState<boolean>(false);



    //그룹 목록 불러오기
    const getGroupList = async (): Promise<GroupList[]|null>=> {
        try{
            const response = await axios.get('/api/groupList');
            console.log('그룹 목록을 불러옵니다.');
            return response.data;
        }catch(error){
            const axiosError = error as AxiosError;
            console.log(axiosError);
            if(axiosError.response?.data){
                stateFilter((axiosError.response.data) as string);
            }
            return null;
        }


    }

    const groupListState = useQuery<GroupList[]|null, Error>({
        queryKey: [QUERY_GROUP_LIST_KEY],
        queryFn: getGroupList, //HTTP 요청함수 (Promise를 반환하는 함수)
        enabled:cookie,
    });
    const redirectDetail = (groupId: number) => {
        navigate("/details", {state: {groupId: groupId}});
    }

    const closeModal = () => {
        setShowMakeGroup(false);
        groupListState.refetch();
    };

    


    return (

        <div>
            <button onClick={() => setShowMakeGroup(true)}>그룹 생성</button>
            {showMakeGroup && <MakeGroup onClose={closeModal}></MakeGroup>}
            {groupListState.isLoading && <div>Loading...</div>}
            {groupListState.data && (
                <div>
                    <h2>Group List</h2>
                    <ul>
                        {groupListState.data.map((group) => (
                            <li key={group.groupId}
                                onClick={() => redirectDetail(group.groupId)}>
                                {group.groupTitle}</li>
                        ))}
                    </ul>
                </div>
            )}
            </div> 
    )

}
export default GroupList;