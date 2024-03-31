package org.example.calenj.Main.DTO.Group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.calenj.Main.domain.Group.GroupUserEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupScheduleDTO {

    private String groupScheduleTitle;
    private String groupScheduleContent;
    private String groupScheduleLocation;
    private String groupScheduleId;
    private GroupUserEntity groupUser;


//    public GroupScheduleDTO(String groupScheduleTitle, String groupScheduleContent, String groupScheduleLocation,String groupScheduleId){
//        this.groupScheduleTitle = groupScheduleTitle;
//        this.groupScheduleContent = groupScheduleContent;
//        this.groupScheduleLocation = groupScheduleLocation;
//        this.groupScheduleId = groupScheduleId;
//    }
}



