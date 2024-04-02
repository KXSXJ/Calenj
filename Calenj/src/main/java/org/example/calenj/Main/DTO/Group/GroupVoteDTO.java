package org.example.calenj.Main.DTO.Group;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.calenj.Main.helper.StringListConverter;
import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupVoteDTO {
    private UUID groupId;
    private UUID voteId;
    private String voteCreater;
    private String voteTitle;
    private List<String> voteItem;
    private String voteCreated;
    private String voteEndDate;
    private Boolean isMultiple;
    private Boolean anonymous;
    private List<String> voter;
    private List<String> voteWatcher;
    private String myId;

    //gv.voteId, gv.voteCreater, gv.voteTitle,gv.voteItem, gv.voteCreated, gv.voteEndDate,gv.isMultiple, gv.anonymous
    public GroupVoteDTO(UUID voteId, String voteCreater, String voteTitle, List<String> voteItem, String voteCreated,String voteEndDate,Boolean isMultiple, Boolean anonymous, List<String> voter, List<String> voteWatcher){
        this.voteId = voteId;
        this.voteCreater = voteCreater;
        this.voteTitle = voteTitle;
        this.voteItem = voteItem;
        this.voteCreated = voteCreated;
        this.voteEndDate = voteEndDate;
        this.isMultiple = isMultiple;
        this.anonymous = anonymous;
        this.voter = voter;
        this.voteWatcher=voteWatcher;

    }
    //list만 불러오기위한 생성자
    public GroupVoteDTO(UUID voteId, String voteCreater, String voteTitle, String voteCreated,String voteEndDate, List<String> voter){
        this.voteId = voteId;
        this.voteCreater = voteCreater;
        this.voteTitle = voteTitle;
        this.voteCreated = voteCreated;
        this.voteEndDate = voteEndDate;
        this.voter = voter;
    }
}
