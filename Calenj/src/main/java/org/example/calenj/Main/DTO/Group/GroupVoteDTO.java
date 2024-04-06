package org.example.calenj.Main.DTO.Group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String voteCreated;
    private String voteEndDate;
    private Boolean isMultiple;
    private Boolean anonymous;
    private List<String> voteWatcher;
    private int countVoter;
    private List<String> postedVoteChoiceDTO; //처음 투표 생성 시 항목을 받아오기 위한 필드
    private List<VoteChoiceDTO> voteChoiceDTO;

    
    

    //gv.group.groupId,gv.voteId, gv.voteCreater, gv.voteTitle, gv.voteCreated, gv.voteEndDate,gv.isMultiple, gv.anonymous, gv.voteWatcher
    public GroupVoteDTO( String voteCreater, String voteTitle, String voteCreated, String voteEndDate, Boolean isMultiple, Boolean anonymous, List<String> voteWatcher, int countVoter) {
        this.voteCreater = voteCreater;
        this.voteTitle = voteTitle;
        this.voteCreated = voteCreated;
        this.voteEndDate = voteEndDate;
        this.isMultiple =isMultiple;
        this.anonymous=anonymous;
        this.voteWatcher=voteWatcher;
        this.countVoter =countVoter;
    }
    
    //list만 불러오기위한 생성자
    public GroupVoteDTO(UUID voteId, String voteCreater, String voteTitle, String voteCreated, String voteEndDate, int countVoter) {
        this.voteId = voteId;
        this.voteCreater = voteCreater;
        this.voteTitle = voteTitle;
        this.voteCreated = voteCreated;
        this.voteEndDate = voteEndDate;
        this.countVoter =countVoter;
    }
}
