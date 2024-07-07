package org.example.calenj.friend.service;

import lombok.RequiredArgsConstructor;
import org.example.calenj.event.domain.EventEntity;
import org.example.calenj.event.service.EventService;
import org.example.calenj.friend.domain.FriendEntity;
import org.example.calenj.friend.dto.response.AddFriendResponse;
import org.example.calenj.friend.dto.response.FriendResponse;
import org.example.calenj.friend.repository.FriendRepository;
import org.example.calenj.global.service.GlobalService;
import org.example.calenj.user.domain.UserEntity;
import org.example.calenj.user.repository.UserRepository;
import org.example.calenj.websocket.service.WebSocketService;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FriendService {
    private final GlobalService globalService;
    private final EventService eventService;
    private final FriendRepository friendRepository;
    //private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;


    /**
     * 이름으로 유저정보 가져오기
     */
    public UserEntity getUserEntityByUserName(String userName) {
        UserEntity userEntity = userRepository.findByUserUsedName(userName).orElse(null);
        return userEntity;
    }

    /**
     * ID로 유저정보 가져오기
     */
    public UserEntity getUserEntityById(UUID userID) {
        UserEntity userEntity = userRepository.findByUserId(userID).orElseThrow(() -> new RuntimeException());
        return userEntity;
    }

    /**
     * 친구목록 가져오기
     */
    public List<FriendResponse> friendList() {
        UUID myUserID = UUID.fromString(globalService.extractFromSecurityContext().getUsername());
        return friendRepository.findFriendListById(myUserID).orElseThrow(() -> new RuntimeException("친구 목록이 비었습니다"));
    }

    /**
     * 친구 요청하기
     */
    public AddFriendResponse requestFriend(String friendUserName) {

        AddFriendResponse response = new AddFriendResponse();
        UserEntity ownUser = globalService.myUserEntity();

        // 나에게 초대는 불가
        if (isAddingSelf(friendUserName, ownUser)) {
            return createErrorResponse("나에게 친구 추가는 불가능합니다.");
        }

        // 친구 유저 정보가 존재하는지 확인
        UserEntity friendUser = getUserEntityByUserName(friendUserName);
        if (friendUser == null) {
            return createErrorResponse("존재하지 않는 아이디입니다. 아이디를 다시 확인해주세요.");
        }

        // 이미 친구인 경우
        if (isAlreadyFriend(friendUser, ownUser)) {
            return createErrorResponse("이미 친구입니다.");
        }

        // 친구 요청
        return processFriendRequest(ownUser, friendUser, response);
    }

    /**
     * 나에게 요청 검사
     */
    private boolean isAddingSelf(String friendUserName, UserEntity ownUser) {
        if (friendUserName.equals(ownUser.getUserUsedName())) {
            return true;
        }
        return false;
    }

    /**
     * 이미 친구인지 검사
     */
    private boolean isAlreadyFriend(UserEntity friendUser, UserEntity ownUser) {
        if (friendRepository.findFriendByIdIsAccept(friendUser.getUserId(), ownUser.getUserId()).orElse("Null").equals("ACCEPT")) {
            return true;
        }
        return false;
    }

    /**
     * 검사요소 통과 못할시 에러로 반환
     */
    private AddFriendResponse createErrorResponse(String message) {
        return responseSetting(false, message, null);
    }

    /**
     * 요청 성공시 반환
     */
    private AddFriendResponse createSuccessResponse(String message, UUID userId) {
        return responseSetting(true, message, userId);
    }

    /**
     * 검사 통과 시 친구 요청 프로세스 진행
     */
    private AddFriendResponse processFriendRequest(UserEntity ownUser, UserEntity friendUser, AddFriendResponse response) {
        if (friendRepository.findFriendById(friendUser.getUserId()).orElse(null) != null) {
            return repositorySetting(friendUser.getUserId());
        } else {
            return onlyOne(ownUser, friendUser.getUserId());
        }
    }

    /**
     * 요청한 대상으로부터의 요청이 이미 있을 경우
     */
    public AddFriendResponse repositorySetting(UUID friendUserId) {
        return createSuccessResponse("상대가 보낸 요청이 이미 있습니다. 친구 요청을 수락하시겠습니까?", friendUserId);
    }

    /**
     * 전부 통과 시 친구 요청을 위한 친구 정보 반환
     */
    public AddFriendResponse onlyOne(UserEntity ownUser, UUID friendUserId) {//동일한 요청 정보가 있다면? -> 저장x
        if (!eventService.checkIfDuplicatedEvent(ownUser.getUserId(), friendUserId)) {
            return createSuccessResponse("친구 정보 조회에 성공했습니다.", friendUserId);
        }
        return createErrorResponse("이미 요청한 유저입니다");
    }

    /**
     * 응답 DTO 세팅
     */
    public AddFriendResponse responseSetting(boolean isSuccess, String message, UUID userId) {
        AddFriendResponse response = new AddFriendResponse();
        response.setSuccess(isSuccess);
        response.setMessage(message);
        response.setUserId(userId);
        return response;
    }

    /**
     * 친구 요청 DB 저장
     */
    public void saveFriend(String friendUsedName, String eventContent) {
        UserEntity ownUser = globalService.myUserEntity();
        UserEntity friendUser = getUserEntityByUserName(friendUsedName);

        FriendEntity friendEntity = FriendEntity
                .builder()
                .ownUserId(ownUser)
                .friendUserId(friendUser.getUserId())
                .nickName(friendUser.getNickname())
                .createDate(String.valueOf(LocalDate.now()))
                .ChattingRoomId(UUID.randomUUID())
                .status(FriendEntity.statusType.WAITING).build();
        //이벤트테이블추가
        eventService.createEvent(eventContent, ownUser, friendUser, "Friend Request");
        friendRepository.save(friendEntity);
        webSocketService.userAlarm(friendUser.getUserId(), "친구요청");
    }

    /**
     * 친구 수락
     */
    public void acceptFriend(UUID friendUserId) {
        UserEntity friendUser = getUserEntityById(friendUserId);
        FriendResponse friendResponse = friendRepository.findFriendById(friendUserId).orElse(null);
        friendRepository.updateStatus(friendUserId, FriendEntity.statusType.ACCEPT);

        FriendEntity friendEntity = FriendEntity
                .builder()
                .ownUserId(globalService.myUserEntity())
                .friendUserId(friendUserId)
                .nickName(friendUser.getNickname())
                .createDate(String.valueOf(LocalDate.now()))
                .ChattingRoomId(friendResponse.getChattingRoomId())
                .status(FriendEntity.statusType.ACCEPT)
                .build();

        friendRepository.save(friendEntity);
        eventService.updateFriendRequest(friendUserId, EventEntity.statusType.ACCEPT);

        //:TODO 확인필요
        // 파일을 저장한다.
        try (FileOutputStream stream = new FileOutputStream("C:\\chat\\chat" + friendEntity.getFriendId(), true)) {
            String nowTime = globalService.nowTime();
            stream.write(friendUser.getNickname().getBytes(StandardCharsets.UTF_8));
            stream.write("프랜드, 친구일자 :".getBytes(StandardCharsets.UTF_8));
            stream.write(nowTime.getBytes(StandardCharsets.UTF_8));
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    /**
     * 친구 요청에 응답
     */
    public AddFriendResponse responseFriend(UUID friendUserId, String isAccept) {

        //요청 정보가 없다면 오류 반환
        FriendResponse friendResponse = friendRepository.findFriendById(friendUserId).orElse(null);
        if (friendResponse == null) {
            return createErrorResponse("올바르지 않은 요청입니다.");
        }

        //거절이라면
        if (isAccept.equals("REJECT")) {
            //요청한 유저 친구목록에서 삭제
            friendRepository.deleteByOwnUserId(friendUserId);
            //이벤트 상태 거절로 변경
            eventService.updateEventState(friendUserId, EventEntity.statusType.REJECT);
            webSocketService.userAlarm(friendUserId, "친구거절");
            return createErrorResponse("친구 요청을 거절했습니다.");
        } else {
            acceptFriend(friendUserId);
            webSocketService.userAlarm(friendUserId, "친구수락");
            return createSuccessResponse("친구 요청을 수락했습니다.", friendUserId);
        }
    }


}