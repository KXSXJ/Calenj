//api 를 통하여 쿠키를 post 하여 boolean 값을 return 받는다.
//accessToken 만료 시 refreshToken 체크 후 재발급, 모든 토큰 만료 시 재로그인 필요
import axios, {AxiosError, AxiosResponse} from "axios";
import {jwtFilter} from "../../authentication/jwt";
import {
    FriendEvent,
    FriendList,
    GroupDetail,
    GroupList_item,
    NoticeList,
    VoteDetail,
    VoteList,
    EventTagDTO,
    UserDateEvent, UserInfo, GroupSchedule, SubSchedule, UserChatInfo, Message, NoticeDetail
} from "../model/types";

//쿠키체크
export const checkCookie = async (): Promise<boolean> => {
    const response = await axios.post('/api/postCookie');
    return response.data;
}
export const logout = async (): Promise<boolean> => {
    try {
        const response = await axios.post('/api/logout');
        return response.data;
    } catch (error) {
        document.location.replace('/')
        return false;
    }
};


//그룹리스트
export const getGroupList = async (): Promise<GroupList_item[] | null> => {
    try {
        const response = await axios.get('/api/groupList');
        const data = response.data as GroupList_item[];
        return data.sort((a, b) => {
            return (Number(b.groupCreated) - Number(a.groupCreated));
        });
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}

export const getGroupDetail = async (groupId: string): Promise<GroupDetail | null> => {
    try {
        const response = await axios.post('/api/groupDetail', {
            groupId: groupId
        }) // 객체의 속성명을 'id'로 설정;
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}

//공지리스트
export const getNoticeList = async (groupId: string): Promise<NoticeList[] | null> => {
    try {
        const response = await axios.post('/api/noticeList', {groupId: groupId});
        // console.log(response.data);
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.data) {
            jwtFilter((axiosError.response.data) as string);
        }
        return null;
    }
}

export const getNoticeDetail = async (noticeId:string) :Promise<NoticeDetail|null> =>{
    try{
        const response = await axios.post('/api/noticeDetail', null, {params: {noticeId: noticeId},
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
        return response.data
    }catch (error){
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.data) {
            jwtFilter((axiosError.response.data) as string);
        }
        return null;
    }

}


//투표리스트 불러오기
export const getVoteList = async (groupId: string): Promise<VoteList[] | null> => {
    try {
        const response = await axios.post('/api/voteList', {groupId: groupId});

        return response.data
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.data) {
            jwtFilter((axiosError.response.data) as string);
        }
        return null;
    }
}

export const getVoteDetail = async (voteId: string): Promise<VoteDetail | null> => {
    try {
        const response = await axios.post('/api/voteDetail', null, {
            params: {
                voteId: voteId
            }
        }) // 객체의 속성명을 'id'로 설정
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.data) {
            jwtFilter((axiosError.response.data) as string);
        }
        return null;
    }
}


//친구리스트 불러오기
export const getFriendList = async (): Promise<FriendList[] | null> => {
    try {
        const response = await axios.get('/api/getFriendList');
        const data = response.data as FriendList[];
        return data.sort((a, b) => {
            return (Number(b.friendAddDate) - Number(a.friendAddDate));
        });
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}


//요청받은 친구 이벤트 가져오기
export const getFriendResponse = async (): Promise<FriendEvent[] | null> => {
    try {
        const response = await axios.get('/api/requestedList');
        const data = response.data as FriendEvent[];
        return data.sort((a, b) => {
            return (Number(b.createDate) - Number(a.createDate));
        });
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}


//요청한 친구 이벤트 가져오기
export const getFriendRequest = async (): Promise<FriendEvent[] | null> => {
    try {
        const response = await axios.get('/api/myRequestList');
        const data = response.data as FriendEvent[];
        return data.sort((a, b) => {
            return (Number(b.createDate) - Number(a.createDate));
        });

    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}
export const getUserBanList = async (): Promise<FriendList[] | null> => {
    try {
        const response = await axios.get('/api/getBanList');
        const data = response.data as FriendList[];
        return data.sort((a, b) => {
            return (Number(b.friendAddDate) - Number(a.friendAddDate));
        });

    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}


export const getDateEventTag = async (): Promise<EventTagDTO[] | null> => {
    try {
        return await axios.get('api/getEventTag').then((res: AxiosResponse<EventTagDTO[]>) => res.data)
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}

export const getUserDateEvent = async (): Promise<UserDateEvent[] | null> => {
    try {
        return await axios.get("api/getUserDateEvent")
            .then((res: AxiosResponse) => {
                return res.data
            })
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}

export const getUserInfo = async (): Promise<UserInfo | null> => {
    try {
        return await axios.get("api/getUserInfo")
            .then((res: AxiosResponse) => res.data)
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}

export const getGroupScheduleList = async (groupId: string): Promise<GroupSchedule[] | null> => {
    try {
        return await axios.post("api/getGroupScheduleList", {groupId})
            .then((res: AxiosResponse) => res.data)
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}


export const getSubScheduleList = async (scheduleId: string): Promise<SubSchedule[] | null> => {
    try {
        return await axios.post("api/getSubScheduleList", {scheduleId})
            .then((res: AxiosResponse<SubSchedule[]>) => {
                return res.data.sort((a, b) => a.index - b.index)
            })
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    }
}


export const getUserChatList = async (): Promise<UserChatInfo[]> => {
    return axios.get('api/getChatList').then((res) => {
        return res.data
    }).catch((err) => {
        const axiosError = err as AxiosError;
        console.log(axiosError);
        if (axiosError.response?.status) {
            console.log(axiosError.response.status);
            jwtFilter((axiosError.response.status).toString());
        }
        return null;
    })
}

export const getMessageData = async (pageParam = {position: "", chatUUID: ""}, stompParam: string, userId: string) => {
    const {position, chatUUID} = pageParam;

    return axios.post('/api/getChattingFile', {
        param: stompParam,
        userId: userId,
        chatId: chatUUID === "" ? null : chatUUID,
        newOrOld: position === "" ? null : position
    }).then((res) => {
        return res.data.filter((message: Message) => message.chatUUID)
    });

}


