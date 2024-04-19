import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import axios, {AxiosResponse, AxiosError} from 'axios';
import {useId} from 'react';
import Notice from './Notice/Notice'
import {DEFAULT_HR, GROUP_USER_LIST, ListView, RowFlexBox} from '../../style/FormStyle'
import Vote from "./Vote/Vote";
import Invite from "./Invite/Invite"
import {connect} from "react-redux";
import {stateFilter} from '../../stateFunc/actionFun';
import {DispatchStompProps, mapDispatchToStompProps} from '../../store/module/StompReducer';
import GroupMsgBox from './../MessageBox/GroupMsgBox';
import {endPointMap} from '../../store/module/StompMiddleware';
import group from "./index";

interface Details {
    groupId: number;
    groupTitle: string;
    groupCreated: string;
    groupCreater: string;
    members: Members[];
}

interface Members {
    groupRoleType: String;
    group_user_location: String;
    nickName: String;
    onlineStatus: string;
    userEmail: string;
}

interface NavigationProps {
    groupId: string
}

const QUERY_GROUP_DETAIL_KEY = 'groupDetail'

/* console = window.console || {};  //콘솔 출력 막는 코드.근데 전체 다 막는거라 걍 배포할때 써야할듯
 console.log = function no_console() {}; // console log 막기
 console.warn = function no_console() {}; // console warning 막기
 console.error = function () {}; // console error 막기*/
const GroupDetail: React.FC<DispatchStompProps & NavigationProps> = ({requestFile, groupId}) => {
    const id = useId();


    //그룹 디테일 불러오기
    const getGroupList = async (): Promise<Details | null> => {
        try {
            const response = await axios.post('/api/groupDetail', {
                groupId: groupId
            }) // 객체의 속성명을 'id'로 설정;
            const data = response.data as Details;
            return data;
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


    const groupDetailState = useQuery<Details | null, Error>({
        queryKey: [QUERY_GROUP_DETAIL_KEY, groupId],
        queryFn: getGroupList, //HTTP 요청함수 (Promise를 반환하는 함수)
    });


    useEffect(() => {
        requestFile({
            target: 'groupMsg',
            param: groupId,
            requestFile: "READ",
            nowLine: endPointMap.get(groupId)
        });
        return () => {
        }
    }, [groupId])

    const reloadTopMessage = (nowLine: number) => {
        requestFile({target: 'groupMsg', param: groupId, requestFile: "RELOAD", nowLine: nowLine})

    }

    const endPointRef = useRef<NodeJS.Timeout | undefined>();

    const updateEndpoint = () => {
        if (endPointRef.current != undefined) {
            clearTimeout(endPointRef.current)
        }
        endPointMap.set(groupId, 0)
        endPointRef.current = setTimeout(() => {
            requestFile({target: 'groupMsg', param: groupId, requestFile: "ENDPOINT", nowLine: 0});

            console.log('엔드포인트 갱신')
        }, 2000)
    }


    return (
        <div style={{width: "100%"}}>
            {groupDetailState.isLoading && <div>Loading...</div>}
            {groupDetailState.data && (
                <div>
                    <div key={groupDetailState.data.groupId}>
                        <div>방아이디: {groupDetailState.data.groupId.toString().slice(0, 9).padEnd(20, '*')}</div>
                        <RowFlexBox style={{justifyContent: 'space-between'}}>
                            <div>방이름: {groupDetailState.data.groupTitle}</div>
                            <div><Invite groupId={groupId}/></div>
                        </RowFlexBox>
                    </div>
                    <DEFAULT_HR/>
                    <div>
                        <GROUP_USER_LIST>
                            {groupDetailState.data.members.map((member) => (
                                <ListView key={member.userEmail}>
                                    {localStorage.getItem(`userId`) === member.userEmail ?
                                        <span>(나) {member.nickName} </span> :
                                        <span>{member.nickName} </span>}
                                    {member.onlineStatus === 'ONLINE' ?
                                        <span style={{color: "green"}}> ● </span> :
                                        <span style={{color: "red"}}> ● </span>
                                    }
                                </ListView>
                            ))}
                        </GROUP_USER_LIST>
                    </div>
                    <DEFAULT_HR/>
                    <GroupMsgBox param={groupId} updateEndpoint={updateEndpoint}
                                 reloadTopMessage={reloadTopMessage} target={'group'}/>
                    <DEFAULT_HR/>
                    <div>
                        <Notice/>
                        <DEFAULT_HR/>
                        <Vote member={groupDetailState.data.members.length}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default connect(null, mapDispatchToStompProps)(GroupDetail);