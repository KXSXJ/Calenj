import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import {useLocation} from 'react-router-dom';
import {stateFilter} from "../../stateFunc/actionFun";

interface Details {
    groupId: number;
    groupCreated: string;
    groupTitle: string;
    groupCreater: string;
}

interface Members {
    groupRoleType: String;
    group_user_location: String;
    nickName: String;
}

const GroupDetail: React.FC = () => {
    //a
    const [detail, setDetail] = useState<Details | null>(null);
    const [members, setMembers] = useState<Members[] | null>(null);
    const location = useLocation();
    const groupInfo = {...location.state};

    useEffect(() => {
        axios.post('/api/groupDetail', null, {
            params: {
                groupId: groupInfo.groupId
            },
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }) // 객체의 속성명을 'id' 로 설정
            .then(response => {
                setDetail(response.data);
                console.log(response.data);
                setMembers(response.data.members);
                console.log(response.data.members);
            })
            .catch(error => console.log(error));
    }, []);


    return (
        <div>
            <div>
                {detail !== null && (
                    <div key={detail.groupId}>
                        <div>Group Detail ID: {detail.groupId}</div>
                        <div>Group Detail Title: {detail.groupTitle}</div>
                    </div>
                )}
            </div>
            <hr/>
            <hr/>
            <div>
                {members !== null && members.map(members => (
                    <div>
                        <div>닉네임 : {members.nickName}</div>
                        <div>역할 : {members.groupRoleType}</div>
                        <div>위치 : {members.group_user_location}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupDetail;