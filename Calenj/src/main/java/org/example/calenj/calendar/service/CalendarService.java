package org.example.calenj.calendar.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.calenj.calendar.domain.Ids.TagId;
import org.example.calenj.calendar.domain.TagEntity;
import org.example.calenj.calendar.domain.UserScheduleEntity;
import org.example.calenj.calendar.dto.request.ScheduleRequest;
import org.example.calenj.calendar.dto.request.ShareScheduleRequest;
import org.example.calenj.calendar.dto.request.SharedPositionRequest;
import org.example.calenj.calendar.dto.request.TagRequest;
import org.example.calenj.calendar.dto.response.ExtendedPropsResponse;
import org.example.calenj.calendar.dto.response.RepeatStateResponse;
import org.example.calenj.calendar.dto.response.ScheduleResponse;
import org.example.calenj.calendar.dto.response.TagResponse;
import org.example.calenj.calendar.repository.RepeatStateRepository;
import org.example.calenj.calendar.repository.TagRepository;
import org.example.calenj.calendar.repository.UserScheduleRepository;
import org.example.calenj.global.service.GlobalService;
import org.example.calenj.group.groupschedule.dto.request.GroupSubScheduleRequest;
import org.example.calenj.websocket.service.WebSocketService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final GlobalService globalService;
    private final WebSocketService webSocketService;

    private final UserScheduleRepository userScheduleRepository;
    private final TagRepository tagRepository;
    private final RepeatStateRepository repeatStateRepository;

    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달

    /**
     * 스케쥴 업데이트
     *
     * @param scheduleRequest 업데이트할 스케쥴 정보
     */
    public void updateSchedule(ScheduleRequest scheduleRequest) {
        // 반복일정일 경우 -> 수정된 날짜만 미포함 + 해당 날짜에 새로운 스케쥴 생성
        // 그냥 일정일 경우 -> 날짜만 변경
        //System.out.println("scheduleRequest : " + scheduleRequest);
        if (scheduleRequest.getExtendedProps().getRepeatState().isRepeat()) {
            updateRepeatSchedule(scheduleRequest);
        } else {
            userScheduleRepository.updateDate(scheduleRequest.getId(), scheduleRequest.getStart(), scheduleRequest.getEnd());
        }
    }

    /**
     * 반복 일정 수정
     *
     * @param scheduleRequest 업데이트할 스케쥴 정보
     */
    public void updateRepeatSchedule(ScheduleRequest scheduleRequest) {
        String exDates = repeatStateRepository.findByScheduleId(scheduleRequest.getId()).orElse(null);
        List<String> dates = RepeatStateResponse.convertStringToArray(exDates);

        dates.add(scheduleRequest.getOldStart().toString());
        repeatStateRepository.addExDate(dates.toString(), scheduleRequest.getId());

        UserScheduleEntity userScheduleEntity = userScheduleRepository.getSchedule(scheduleRequest.getId()).orElse(null);

        scheduleRequest.getExtendedProps().getRepeatState().setRepeat(false);
        scheduleRequest.getExtendedProps().getRepeatState().setRepeatCount(1);
        scheduleRequest.setId(null);

        if (scheduleRequest.getEnd() == null) {
            scheduleRequest.setEnd(scheduleRequest.getStart());
        }

        scheduleRequest.setTitle(userScheduleEntity != null ? userScheduleEntity.getUserScheduleTitle() : null);

        saveSchedule(scheduleRequest);
    }

    /**
     * 스케쥴 삭제
     *
     * @param scheduleID 삭제할 스케쥴 아이디
     */
    public void deleteSchedule(UUID scheduleID) {
        UUID myUserName = UUID.fromString(globalService.extractFromSecurityContext().getUsername());
        repeatStateRepository.deleteByScheduleId(scheduleID, myUserName);
        userScheduleRepository.deleteByScheduleId(scheduleID, myUserName);
    }


    /**
     * 스케쥴 추가
     *
     * @param scheduleRequest 추가할 스케쥴 정보
     */
    public void saveSchedule(ScheduleRequest scheduleRequest) {
        UserScheduleEntity checkEntity = userScheduleRepository.getSchedule(scheduleRequest.getId()).orElse(null);
        if (checkEntity != null) {
            //이미 있는 정보일 경우 수정
            //로직 수행
            UserScheduleEntity userScheduleEntity = scheduleRequest.toEntity(globalService.getUserEntity(null));
            userScheduleRepository.save(userScheduleEntity);
            return;
        }
        UserScheduleEntity userScheduleEntity = scheduleRequest.toEntity(globalService.getUserEntity(null));
        repeatStateRepository.save(scheduleRequest.getExtendedProps().getRepeatState().toEntity(userScheduleRepository.save(userScheduleEntity)));
    }

    /**
     * 스케쥴 목록 조회
     *
     * @return 스케쥴 목록 반환
     */
    public List<ScheduleResponse> getScheduleList() {

        //schedule
        List<ScheduleResponse> scheduleResponses = userScheduleRepository.findListByUserId(globalService.getUserEntity(null).getUserId()).orElse(null);

        if (scheduleResponses.isEmpty()) {
            return scheduleResponses; // 조기 반환을 통해 불필요한 연산 방지
        }

        List<UUID> ids = scheduleResponses.stream().map(ScheduleResponse::getId).collect(Collectors.toList());
        //repeatState
        List<RepeatStateResponse> repeatStateResponses = repeatStateRepository.findAllByIds(ids);

        Map<UUID, RepeatStateResponse> repeatStateMap = repeatStateResponses.stream()
                .collect(Collectors.toMap(RepeatStateResponse::getScheduleId, Function.identity()));

        // ScheduleResponses 각각에 대해 RepeatStateResponse 매칭 및 설정
        scheduleResponses.forEach(schedule -> {
            RepeatStateResponse repeatState = repeatStateMap.get(schedule.getId());
            if (repeatState != null) {
                ExtendedPropsResponse extendedProps = schedule.getExtendedProps();
                extendedProps.setRepeatState(repeatState); // RepeatStateResponse 설정
            }
        });
        return scheduleResponses;
    }

    /**
     * 스케쥴 태그 목록 조회
     *
     * @return 스케쥴 태그 목록
     */
    public List<TagResponse> getTagEntityList() {
        return tagRepository.findByUserId(globalService.getUserEntity(null).getUserId()).orElseThrow(() -> new RuntimeException("오류 발생!"));
    }

    /**
     * 태그 저장
     *
     * @param tagRequest 저장할 태그 정보
     * @return 저장된 태그 반환
     */
    public TagResponse saveTag(TagRequest tagRequest) {
        TagEntity tag = tagRepository.save(tagRequest.toEntity(globalService.getUserEntity(null)));
        TagResponse tagResponse = new TagResponse(tag.getTagId(), tag.getTag(), tag.getTagColor(), tag.isDefaultTag());
        return tagResponse;
    }

    /**
     * 태그 삭제
     *
     * @param id 삭제할 태그 아이디
     */
    public void deleteTag(UUID id) {
        tagRepository.deleteById(new TagId(id, globalService.getUserEntity(null)));
    }

    /**
     * 일정 공유
     *
     * @param scheduleRequest
     */
    public void shareSchedule(ShareScheduleRequest scheduleRequest) {
        UUID userId = UUID.fromString(globalService.extractFromSecurityContext().getUsername());


        ScheduleResponse scheduleResponse = userScheduleRepository.findByScheduleId(scheduleRequest.getScheduleId()).orElse(null);
        RepeatStateResponse repeatStateresponse = repeatStateRepository.findOneByIds(scheduleResponse.getId()).orElse(null);
        scheduleResponse.getExtendedProps().setRepeatState(repeatStateresponse);

        if (scheduleResponse.getExtendedProps().getTodoList().isEmpty()) {
            scheduleResponse.getExtendedProps().setTodoList(null);
        }
        if (scheduleResponse.getExtendedProps().getFriendList().isEmpty()) {
            scheduleResponse.getExtendedProps().setFriendList(null);
        }
        ObjectMapper mapper = new ObjectMapper();
        String jsonString;
        try {
            jsonString = mapper.writeValueAsString(scheduleResponse);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        for (SharedPositionRequest positionRequest : scheduleRequest.getSharedPositionRequests()) {
            webSocketService.groupEventChat(positionRequest.getChatId(), userId.toString(), "schedule", jsonString);
        }
    }


    public void updateSharedGroupSchedule(UUID subScheduleId, GroupSubScheduleRequest subSchedule) {
        // 1. 그룹 스케줄 목록을 조회
        List<UserScheduleEntity> groupSchedules = userScheduleRepository.getGroupSchedules(subScheduleId).orElse(null);

        // 2. 조회된 스케줄이 있는지 확인 후 업데이트
        if (groupSchedules != null && !groupSchedules.isEmpty()) {


        }
    }

}

