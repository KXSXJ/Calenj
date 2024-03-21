package org.example.calenj.Main.DTO.Group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupNoticeDTO {
    private UUID groupId;
    private UUID noticeId;
    private String noticeTitle;
    private String noticeCreated;
    private String noticeContent;
    private String noticeCreater;
    private List<String> noticeWatcher;


    //noticeTitle, gn.noticeContent, gn.noticeWatcher, gn.noticeCreater, gn.noticeCreated


    public GroupNoticeDTO(UUID noticeId, String noticeTitle, String noticeContent, String noticeCreater, String noticeCreated) {
        this.noticeTitle = noticeTitle;
        this.noticeContent = noticeContent;
        this.noticeCreater = noticeCreater;
        this.noticeCreated = noticeCreated;
        this.noticeId = noticeId;
    }


    public GroupNoticeDTO(UUID noticeId, String noticeTitle, String noticeContent, String noticeCreater, String noticeCreated,  List<String> noticeWatcher) {
        this.noticeTitle = noticeTitle;
        this.noticeContent = noticeContent;
        this.noticeCreater = noticeCreater;
        this.noticeCreated = noticeCreated;
        this.noticeWatcher = noticeWatcher;
        this.noticeId = noticeId;
    }



}
