package org.example.calenj.calendar.controller;

import lombok.RequiredArgsConstructor;
import org.example.calenj.calendar.dto.request.ScheduleRequest;
import org.example.calenj.calendar.dto.request.TagRequest;
import org.example.calenj.calendar.dto.response.ScheduleResponse;
import org.example.calenj.calendar.dto.response.TagResponse;
import org.example.calenj.calendar.service.CalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    /**
     * 개인 스케쥴 저장
     *
     * @param scheduleRequest 저장할 스케쥴 정보
     * @return 저장 성공여부
     */
    @PostMapping("api/saveUserSchedule")
    public ResponseEntity<String> saveUserSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        calendarService.saveSchedule(scheduleRequest);
        return ResponseEntity.ok("스케쥴 저장 성공");
    }

    /**
     * 개인 스케쥴 조회
     *
     * @return 스케쥴 목록
     */
    @GetMapping("api/getUserDateEvent")
    public List<ScheduleResponse> selectUserSchedule() {
        return calendarService.getScheduleList();
    }

    /**
     * 개인 스케쥴 업데이트
     *
     * @param scheduleRequest 수정할 스케쥴 정보
     */
    @PutMapping("api/updateUserSchedule")
    public void updateUserSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        calendarService.updateSchedule(scheduleRequest);
    }

    /**
     * 개인 스케쥴 삭제
     *
     * @param scheduleRequest 삭제할 스케쥴 정보
     */
    @PostMapping("api/deleteUserSchedule")
    public void deleteUserSchedule(@RequestBody ScheduleRequest scheduleRequest) {
        calendarService.deleteSchedule(scheduleRequest.getId());
    }

    /**
     * 스케쥴 태그 조회
     *
     * @return 스케쥴 태그 목록
     */
    @GetMapping("api/getEventTag")
    public List<TagResponse> getTagList() {
        return calendarService.getTagEntityList();
    }


    /**
     * 스케쥴 태그 생성
     *
     * @param tagRequest 생성할 태그 정보
     * @return 저장된 태그 반환
     */
    @PostMapping("api/createTag")
    public TagResponse createTag(@RequestBody TagRequest tagRequest) {
        return calendarService.saveTag(tagRequest);
    }

    /**
     * 스케쥴 태그 삭제
     *
     * @param tagRequest 삭제할 태그 정보
     * @return 삭제된 태그 반환
     */
    @PostMapping("api/deleteTag")
    public void deleteTag(@RequestBody TagRequest tagRequest) {
        calendarService.deleteTag(tagRequest.getId());
    }


    //------------------------------------------------------

    /**
     * 그룹 스케쥴 저장
     **/
    public ResponseEntity<String> saveGroupSchedule() {
        return ResponseEntity.ok("스케쥴 저장 성공");
    }

    /**
     * 그룹 스케쥴 조회
     **/
    public ResponseEntity<String> selectGroupSchedule() {
        return ResponseEntity.ok("스케쥴 저장 성공");
    }

    /**
     * 그룹 스케쥴 업데이트
     **/
    public ResponseEntity<String> updateGroupSchedule() {
        return ResponseEntity.ok("스케쥴 저장 성공");
    }

    /**
     * 그룹 스케쥴 삭제
     **/
    public ResponseEntity<String> deleteGroupSchedule() {
        return ResponseEntity.ok("스케쥴 저장 성공");
    }
}
