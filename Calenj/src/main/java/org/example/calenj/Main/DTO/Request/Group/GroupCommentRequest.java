package org.example.calenj.Main.DTO.Request.Group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupCommentRequest {
    private UUID groupId;
    private int comment_id;
    private String commented_by;
    private String comment_user;
    private String comment_content;
    private String comment_date;
}
