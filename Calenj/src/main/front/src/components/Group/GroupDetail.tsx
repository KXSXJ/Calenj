import React, {useLayoutEffect, useState} from 'react';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {useId} from 'react';
import Room from "../../Test/room";
import Chatting from "../../Test/Chatting";
import Notice from './Notice/Notice'

interface Details {
    groupId: string;
    groupTitle: string;  
    groupCreated: string;
    groupCreater: string;   
}

interface Members {
    groupRoleType: String;
    group_user_location: String;
    nickName: String;
    userEmail: String;
}

const GroupDetail: React.FC = () => {
    //a
    const [detail, setDetail] = useState<Details | null>(null);
    const [members, setMembers] = useState<Members[] | null>(null);
    const location = useLocation();
    const groupInfo = {...location.state};
    const id = useId();


    useLayoutEffect(() => {
        axios.post('/api/groupDetail', null, {
            params: {
                groupId: groupInfo.groupId
            },
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }) // 객체의 속성명을 'id'로 설정
            .then(response => {
                setDetail(response.data);
                setMembers(response.data.members);
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
            <div>
                {members !== null && members.map(members => (
                    <div key={`${id}-${members.userEmail}`}>
                        <div>닉네임 : {members.nickName}</div>
                        <div>역할 : {members.groupRoleType}</div>
                        <div>위치 : {members.group_user_location}</div>
                    </div>
                ))}
            </div>
            <hr/>
            <div>
                {/* {detail && <Room groupName={detail.groupTitle} groupId={detail.groupId}/>} */}
                {/*  <Chatting></Chatting> */}
            </div>
            <hr/>
           <Notice/>
            
        </div>
    );
}

export default GroupDetail;