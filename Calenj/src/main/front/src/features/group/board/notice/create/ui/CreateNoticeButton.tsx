import React from 'react';
import {Modal_Condition_Button} from '../../../../../../shared/ui/SharedStyled';
import {createNotice} from '../model/createNotice';
import {useFetchNoticeList} from "../../../../../../entities/reactQuery";
import {useDispatch, useSelector} from "react-redux";

import {RootState, updateClickState} from "../../../../../../entities/redux";
import {NoticeButtonsProps} from "../model/types";



export const CreateNoticeButton: React.FC<NoticeButtonsProps> = ({title,content}) => {
    const {param} = useSelector((state:RootState)=> state.subNavigation.group_subNavState)
    const dispatch = useDispatch()
    const onClose = ()=>{
        dispatch(updateClickState({clickState: ''}))
    }

    const noticeListState = useFetchNoticeList(param)
    return (
        <Modal_Condition_Button $isAble={content !== '' && title !== ''} onClick={() => {
            createNotice(title, content, onClose, param,  noticeListState)
        }}>
            등록
        </Modal_Condition_Button>
    );
};

