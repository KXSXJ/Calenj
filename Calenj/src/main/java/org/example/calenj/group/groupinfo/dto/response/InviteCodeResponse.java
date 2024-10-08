package org.example.calenj.group.groupinfo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InviteCodeResponse {


    private UUID groupId;
    private String inviter;
    private String inviteCode;
    private String endDateTime;
    private int useCount;
    private int maxUseAble;
    // --------임의 추가 변수
    private String groupTitle;
    private int memberCount;
    private String ableCode;
    private int onlineCount;

    public InviteCodeResponse(UUID groupId, String groupTitle, String nickname, String endDateTime, int useAbleCount, int maxUseAble) {
        this.groupId = groupId;
        this.groupTitle = groupTitle;
        this.inviter = nickname;
        this.endDateTime = endDateTime;
        this.useCount = useAbleCount;
        this.maxUseAble = maxUseAble;
    }

    public InviteCodeResponse(String nickname, String inviteCode, String endDateTime, int useCount) {
        this.inviter = nickname;
        this.inviteCode = inviteCode;
        this.endDateTime = endDateTime;
        this.useCount = useCount;
    }
}


