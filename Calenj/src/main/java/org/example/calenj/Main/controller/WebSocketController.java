package org.example.calenj.Main.controller;

import lombok.RequiredArgsConstructor;
import org.example.calenj.Main.DTO.Request.Chat.ChatMessageRequest;
import org.example.calenj.Main.DTO.Response.Chat.ChatMessageResponse;
import org.example.calenj.Main.Service.WebSoket.WebSokcetService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달
    private final WebSokcetService webSokcetService;

    //그룹 채팅
    @MessageMapping("/groupMsg")
    public void groupMsg(Authentication authentication, ChatMessageRequest message) throws Exception {
        String username = webSokcetService.returnNickname(authentication);
        String userEmail = webSokcetService.returnEmail(username);

        message.setNickName(username);
        message.setUseEmail(userEmail);

        ChatMessageResponse response = filterNullFields(message);

        //알림 갯수 반환
        if (message.getState() == ChatMessageRequest.fileType.ALARM) {
            try {
                // 파일로부터 채팅 내용을 읽어와서 보내기
                int setPoint = webSokcetService.countLinesUntilEndPoint(message);
                response.setEndPoint(setPoint);
                template.convertAndSendToUser(response.getUseEmail(), "/topic/groupMsg/" + response.getGroupMsg(), response);
            } catch (Throwable e) {
                // 에러가 발생할 경우.
                e.printStackTrace();
            }
            // State가 1이라면 일반 메시지
        } else if (message.getState() == ChatMessageRequest.fileType.READ) {
            List<String> file = webSokcetService.readGroupChattingFile(message);
            response.setMessage(file);
            template.convertAndSendToUser(response.getUseEmail(), "/topic/groupMsg/" + response.getGroupMsg(), response);
        } else if (message.getState() == ChatMessageRequest.fileType.SEND) {
            webSokcetService.saveChattingToFile(message);
            response.setMessage(Collections.singletonList(message.getMessage()));
            template.convertAndSend("/topic/groupMsg/" + response.getGroupMsg(), response);
            //2라면 나갈 때 엔드포인트 설정
        } else if (message.getState() == ChatMessageRequest.fileType.ENDPOINT) {
            //파일에 엔드포인트 저장
            webSokcetService.saveChattingToFile(message);
        }
    }

    //친구에게 알림 보내기
    @MessageMapping("/friendMsg")
    public void friendMsg(Authentication authentication, ChatMessageRequest message) throws Exception {
        String username = webSokcetService.returnNickname(authentication);
        String userEmail = webSokcetService.returnEmail(username);

        message.setNickName(username);
        message.setUseEmail(userEmail);

        ChatMessageResponse response = filterNullFields(message);

        //알림 갯수 반환
        if (message.getState() == ChatMessageRequest.fileType.ALARM) {
            try {
                // 파일로부터 채팅 내용을 읽어와서 보내기
                int setPoint = webSokcetService.countLinesUntilEndPoint(message);
                response.setEndPoint(setPoint);
                template.convertAndSendToUser(response.getUseEmail(), "/topic/friendMsg/" + response.getFriendMsg(), response);
            } catch (Throwable e) {
                // 에러가 발생할 경우.
                e.printStackTrace();
            }
            // State가 1이라면 일반 메시지
        } else if (message.getState() == ChatMessageRequest.fileType.READ) {
            List<String> file = webSokcetService.readGroupChattingFile(message);
            response.setMessage(file);
            template.convertAndSendToUser(response.getUseEmail(), "/topic/friendMsg/" + response.getFriendMsg(), response);
        } else if (message.getState() == ChatMessageRequest.fileType.SEND) {
            webSokcetService.saveChattingToFile(message);
            response.setMessage(Collections.singletonList(message.getMessage()));
            template.convertAndSend("/topic/friendMsg/" + response.getFriendMsg(), response);
            //2라면 나갈 때 엔드포인트 설정
        } else if (message.getState() == ChatMessageRequest.fileType.ENDPOINT) {
            //파일에 엔드포인트 저장
            webSokcetService.saveChattingToFile(message);
        }
    }

    //알림을 위한 개인 구독 (온라인 전환도 할 예정)
    @MessageMapping("/personalTopic")
    public void personalTopic(Authentication authentication, ChatMessageRequest message) throws Exception {
        ChatMessageResponse response = filterNullFields(message);
        template.convertAndSend("/topic/personalTopic/" + message.getPersonalTopic(), response);
    }


    // null이 아닌 필드만 포함시키는 메소드
    private ChatMessageResponse filterNullFields(ChatMessageRequest request) {
        ChatMessageResponse filteredResponse = new ChatMessageResponse();
        if (request.getGroupMsg() != null) {
            filteredResponse.setGroupMsg(request.getGroupMsg());
        }
        if (request.getMessage() != null) {
            filteredResponse.setMessage(Collections.singletonList(request.getMessage()));
        }
        if (request.getNickName() != null) {
            filteredResponse.setNickName(request.getNickName());
        }
        if (request.getUseEmail() != null) {
            filteredResponse.setUseEmail(request.getUseEmail());
        }
        if (request.getFriendMsg() != null) {
            filteredResponse.setFriendMsg(request.getFriendMsg());
        }
        filteredResponse.setState(request.getState());
        filteredResponse.setEndPoint(request.getEndPoint());
        // 필요한 필드들을 추가로 확인하여 null이 아닌 것만 설정
        return filteredResponse;
    }
}
