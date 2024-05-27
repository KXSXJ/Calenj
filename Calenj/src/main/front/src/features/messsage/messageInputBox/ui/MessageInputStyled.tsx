import {TextColor, TextColor2, ThemaColor3} from "../../../../style/FormStyle";
import styled from "styled-components";
import {MessageSend_Cotainer_height} from "../../messageScrollBox/ui/MessageScrollBoxStyled";

export const MessageSend_Input = styled.input`
    background-color: ${ThemaColor3}60;
    color: ${TextColor};
    border-radius: 4px;
    border: 1px solid ${TextColor2};
    width: calc(100% - 5px);
    height: 35px;
    margin-inline: 5px;
`


export const MessageSend_Cotainer = styled.form`
    height: ${MessageSend_Cotainer_height}px; //메시지 박스크기 50px
    display: flex;
`