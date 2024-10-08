import {
    Message_Box_Container,
    MessageIcon_Container, MessageInput_Container,
    MessageSend_Container,
    MessageSend_Textarea
} from "./MessageInputStyled";
import {useMessageInput} from "../model/useMessageInput";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../entities/redux";
import {useEffect, useState} from "react";
import { useMultiImageHandler} from "../../../../shared/model";
import {MultiImageScreen} from "../../messageImageBox";

interface MessageBoxProps{
    messageBoxRef : React.RefObject<HTMLDivElement>;
}
export const MessageInput : React.FC<MessageBoxProps> = ({messageBoxRef}) =>{
    const multiImageHandler = useMultiImageHandler(messageBoxRef);
    const {chatRef, handleKeyPress, textAreaHandler} = useMessageInput(multiImageHandler)
    const {inputSize} = useSelector((state:RootState) => state.messageInputSize);
    const [isFocus, setIsFocus] = useState(false)



    return(
        <MessageSend_Container $inputSize={inputSize}>
            <Message_Box_Container $isFocus={isFocus}>
                <MultiImageScreen useMultiImageHandler={multiImageHandler} isFocus={isFocus}/>
                <MessageInput_Container>
                    <MessageIcon_Container onClick={() => document.getElementById('fileInput')?.click()}>
                        <i className="bi bi-plus-circle-fill"></i>
                    </MessageIcon_Container>
                    <MessageSend_Textarea
                        ref={chatRef}
                        rows={1}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={textAreaHandler}
                        onKeyDown={handleKeyPress}>
                    </MessageSend_Textarea>
                </MessageInput_Container>
            </Message_Box_Container>
        </MessageSend_Container>
    )
}