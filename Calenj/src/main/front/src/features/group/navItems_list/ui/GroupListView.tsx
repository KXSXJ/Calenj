import {CreateGroup} from '../../create';
import {useEffect, useState} from 'react';
import {
    GroupList_Container,
    Btn_CalenJ_Icon,
    Li_GroupList_Item,
    GroupListTitle,
    GroupList_HR,
    Btn_MakeGroup,
    SignOfMessageNum,
    NavigateState,
    GroupTitleView_Container,
    GroupTitleViewTail,
    GroupTitleViewContent,
    GroupListContent_Container,
} from './GroupListStyle';
import {endPointMap, RootState} from '../../../../entities/redux'
import {useSelector} from 'react-redux'
import {useFetchGroupList, GroupList_item} from "../../../../entities/reactQuery";
import {useNavigation} from "../model/useNavigation";
import {createPortal} from "react-dom";



export const GroupListView: React.FC = () => {
    const  navigationDirect = useNavigation();
    const [showMakeGroup, setShowMakeGroup] = useState<boolean>(false);
    const [titleView,setTitleView] = useState<string|null>(null);
    const stomp = useSelector((state: RootState) => state.stomp); // 리덕스 상태 구독
    const {navigateParam} = useSelector((state:RootState) => state.navigateInfo);

    //그룹 목록 불러오기
    const groupListState = useFetchGroupList(stomp.isOnline)


    return (
        <>
            {showMakeGroup && <CreateGroup onClose={()=>setShowMakeGroup(false)}></CreateGroup>}
            {groupListState.isLoading && <div>Loading...</div>}
            {groupListState.data && (
                <GroupList_Container>
                    <GroupListContent_Container>
                        <Btn_CalenJ_Icon $isClick={navigateParam===""} onClick={() => navigationDirect("main")}/>
                        <GroupList_HR/>
                        {groupListState.data.map((group:GroupList_item) => (

                            <Li_GroupList_Item onMouseEnter={()=>{setTitleView(group.groupId)}}
                                               onMouseLeave={()=>setTitleView(null)}
                                               $isClick={navigateParam===group.groupId} key={group.groupId}
                                               onClick={() => navigationDirect("group", group.groupId)}>
                                <NavigateState $isClick={navigateParam===group.groupId}/>
                                <GroupListTitle>
                                    {group.groupTitle}
                                </GroupListTitle>
                                <SignOfMessageNum $existMessage={endPointMap.get(group.groupId) || 0 !== 0}>
                                    {endPointMap.get(group.groupId) !== 0 && endPointMap.get(group.groupId)}
                                </SignOfMessageNum>
                                {group.groupId === titleView &&
                                    <GroupTitleView_Container>
                                        <GroupTitleViewTail/>
                                        <GroupTitleViewContent>
                                            {group.groupTitle}
                                        </GroupTitleViewContent>
                                    </GroupTitleView_Container>
                                }
                            </Li_GroupList_Item>
                        ))}
                        <Btn_MakeGroup onClick={() => setShowMakeGroup(true)}>+</Btn_MakeGroup>
                    </GroupListContent_Container>
                </GroupList_Container>
            )}
        </>
    )
}
