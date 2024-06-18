import styled from 'styled-components'
import {PointColor2} from "../../../../shared/ui/SharedStyled";

interface CheckBeforeSender {
    $sameUser: boolean,
}

interface UserProfile{
    $userId: string | undefined
}

export const ScrollMin_width = 350;
export const ScrollMarginInline = 10;
export const MessageSend_Container_height = 50;



/** 채팅창 Container-스크롤 박스 */
export const ScrollableDiv = styled.div`
    overflow-y: auto; /* 수직 스크롤을 활성화. */
    max-width: calc(100% - ${ScrollMarginInline}); //padding만큼 뺌
    height: calc(100% - ${MessageSend_Container_height}px);
    margin-inline: ${ScrollMarginInline / 2}px;
`;


/** 메시지 관련 styled */
export const MessageBoxContainer = styled.div<CheckBeforeSender>`
    padding-top: ${props => (props.$sameUser ? '0px' : '12px')};
    padding-inline: 12px;
    padding-bottom: 0px;
    user-select: text;
`
export const ProfileContainer = styled.div<UserProfile>`
    width: 40px;
    height: 40px;
    min-width: 40px;
    padding: 3px;
    border-radius: 50px;
    background-color: #007bff;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    font-size: 20px;
    color: white;
    font-weight: 550;
    user-select: none;
    background-image: ${props => props.$userId? `url("/image/savedImage/${props.$userId.trim()}.jpeg")` : `url("/image/Logo.png")`};
    background-size: 40px 40px; /* 너비 100px, 높이 100px */
`


export const NickNameContainer = styled.div`
    font-weight: 550;
`

export const DateContainer = styled.div`
    color: ${PointColor2};
    font-size: 12px;
    margin-top: 2px;
`
export const MessageContentContainer = styled.div`
    max-width: ${ScrollMin_width - 74}px;
`

/**메세지를 담는 컨테이너 1 */
export const MessageContainer = styled.div`
    margin-left: 10px;

    ${NickNameContainer} {
        padding: 2px;
    }

    ${DateContainer} {
        padding: 2px;
        margin-left: 4px;
    }

    ${MessageContentContainer} {
        padding: 2px;
    }

`
export const DateContainer2 = styled.div`
    color: transparent;
    font-size: 12px;
    margin-top: 2px;
    letter-spacing: -1px;
    width: 50px;
`
export const MessageContentContainer2 = styled.div`
    margin-left: 6px;
    max-width: ${ScrollMin_width - 74}px;
`
/** 메시지를 담는 컨테이너 2*/
export const MessageContainer2 = styled.div`
    display: flex;
    flex-direction: row;
    padding: 2px;

    &:hover {
        ${DateContainer2} {
            color: gray;
        }
    }
`



//채팅 endPoint선
export const HR_ChatEndPoint = styled.hr`
    line-height: 1em;
    position: relative;
    outline: 0;
    border: 0;
    color: black;
    text-align: center;
    height: 1.5em;

    &:before {
        content: '';
        background: linear-gradient(to right, rgba(0, 0, 0, 0), #b24ad0, #802bc2);
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 2px;
    }

    &:after {
        content: attr(data-content);
        position: relative;
        display: inline-block;
        padding: 0 .3em;
        line-height: 1.5em;
        margin-left: 90vw;
        color: white;
        border-radius: 10px;
        font-size: 15px;
        font-weight: bold;
        font-family: sans-serif;
        background-color: #b24ad0;
    }
`

