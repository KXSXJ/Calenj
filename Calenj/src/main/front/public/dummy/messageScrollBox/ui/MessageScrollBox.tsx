// import {useMessageScroll} from "../../../../src/features/messsage";
// import {useMessageData} from "../model/useMessageData";
// import {useEffect, useMemo, useState} from "react";
// import {AHMFormat, AHMFormatV2, changeDateForm, shortAHMFormat, throttleByAnimationFrame} from "../../../../src/shared/lib";
// import {useComponentSize, useIntersect} from "../../../../src/shared/model";
// import {useDispatch, useSelector} from "react-redux";
// import {endPointMap, RootState, scrollPointMap, updateAppPosition} from "../../../../src/entities/redux";
// import {
//     DateContainer,
//     DateContainer2, HR_ChatEndPoint, HR_NewDate, ImageContent, ImageWrapper,
//     MessageBoxContainer, MessageContainer,
//     MessageContainer2, MessageContentContainer,
//     MessageContentContainer2, MessageGridView, MessageScroll_Container, NickNameContainer, ProfileContainer,
//     ScrollableDiv
// } from "./MessageScrollBoxStyled";
// import {RowFlexBox} from "../../../../src/shared/ui/SharedStyled";
// import {Message} from "../../../../src/entities/reactQuery"
// import {dateOperation} from "../lib/dateOperation";
//
// export const MessageScrollBox: React.FC = () => {
//     const {inputSize} = useSelector((state: RootState) => state.messageInputSize);
//     const {userNameStorage} = useSelector((state: RootState) => state.userNameStorage);
//     const stomp = useSelector((state: RootState) => state.stomp)
//     const {messageList, newMessageList, chatFile, compareDate, isFetching} = useMessageData(stomp.param)
//     const scrollRef = useMessageScroll(stomp.param, messageList, isFetching)
//
//
//     const loadFile = useMemo(() => {
//         return throttleByAnimationFrame(() => {
//             if (!scrollRef.current) return
//             chatFile.fetchNextPage()
//         })
//     }, [stomp.param])
//
//     const topRef = useIntersect((entry, observer) => {
//         if (chatFile.hasNextPage && !chatFile.isFetching && !isFetching) {
//             observer.unobserve(entry.target);
//             loadFile();
//         }
//     });
//
//
//     const MessageBox = useMemo(() => {
//         const connectList = [...[...messageList].reverse(), ...newMessageList].filter((messageData) =>
//             (endPointMap.get(stomp.param) === 0 && messageData.chatUUID !== '엔드포인트' && messageData.chatUUID !== '시작라인') || (endPointMap.get(stomp.param) > 0 && messageData.chatUUID !== '시작라인')
//         );
//
//         if (!chatFile.isLoading) {
//             return (
//                 <ScrollableDiv ref={scrollRef}>
//                     <div className="scrollTop" ref={topRef}></div>
//                     {connectList.map((message: Message, index: number) => (
//                         <div key={message.chatUUID + index}>
//                             {(index !== 0 && compareDate(connectList[index - 1].sendDate, message.sendDate) && (message.chatUUID !== '엔드포인트')) &&
//                                 <HR_NewDate
//                                     data-content={AHMFormat(changeDateForm(message.sendDate.slice(0, 16))).slice(0, 13)}></HR_NewDate>}
//                             <MessageBoxContainer className={message.chatUUID}
//                                                  key={message.chatUUID + index}
//                                                  $sameUser={(index !== 0 && connectList[index - 1]?.userId === message.userId) &&
//                                                      dateOperation(connectList[index - 1].sendDate, message.sendDate)}>
//                                 {message.chatUUID === '엔드포인트' ?
//
//                                     <HR_ChatEndPoint data-content={"NEW"}></HR_ChatEndPoint> :
//                                     ((index && connectList[index - 1]?.userId === message.userId) &&
//                                     dateOperation(connectList[index - 1].sendDate, message.sendDate) ? (
//                                         <MessageContainer2>
//                                             <DateContainer2>{shortAHMFormat(changeDateForm(message.sendDate.slice(0, 16)))}</DateContainer2>
//                                             <MessageContentContainer2>
//                                                 {(message.messageType === 'null' || message.messageType === null) && message.message.replace(/\\lineChange/g, '\n').trim()}
//                                             </MessageContentContainer2>
//                                         </MessageContainer2>
//                                     ) : (
//                                         <RowFlexBox style={{width: 'auto'}}>
//                                             <ProfileContainer
//                                                 $userId={message.userId}>
//                                             </ProfileContainer>
//                                             <MessageContainer>
//                                                 <RowFlexBox>
//                                                     <NickNameContainer>{userNameStorage[message.userId].userName}</NickNameContainer>
//                                                     <DateContainer>{AHMFormatV2(changeDateForm(message.sendDate.slice(0, 16)))}</DateContainer>
//                                                 </RowFlexBox>
//                                                 <MessageContentContainer>
//                                                     <>
//                                                         {message.messageType === 'image' && (
//                                                             <MessageGridView>
//                                                                 {message.message.trim().slice(1, -1).split(',').map((image, index) => (
//                                                                     <ImageWrapper key={index}>
//                                                                         <ImageContent
//                                                                             $image={image.split('/')[0].trim()}>
//                                                                             {image.split('/')[0].trim()}
//                                                                             {/*{image.split('/')[1].trim()}*/}
//                                                                         </ImageContent>
//                                                                     </ImageWrapper>
//                                                                 ))}
//                                                             </MessageGridView>
//                                                         )}
//                                                         {(message.messageType === 'null' || message.messageType === null) && (
//                                                             <div>
//                                                                 {message.message.replace(/\\lineChange/g, '\n').trim()}
//                                                             </div>
//                                                         )}
//                                                     </>
//                                                 </MessageContentContainer>
//                                             </MessageContainer>
//                                         </RowFlexBox>
//                                     ))
//                                 }
//                             </MessageBoxContainer>
//                         </div>)
//                     )}
//                 </ScrollableDiv>
//             );
//         }
//         return null;
//     }, [messageList, newMessageList]);
//
//
//     return (
//         <MessageScroll_Container $inputSize={inputSize}>
//             {MessageBox}
//         </MessageScroll_Container>
//     )
// }