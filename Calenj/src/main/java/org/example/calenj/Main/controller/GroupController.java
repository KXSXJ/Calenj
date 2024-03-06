package org.example.calenj.Main.controller;

import org.example.calenj.Main.DTO.Group.GroupDTO;
import org.example.calenj.Main.model.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    @Autowired
    GroupService groupService;

    //그룹 만들기
    @PostMapping("/api/makeGroup")
    public void makeGroup(@RequestBody GroupDTO groupDTO) {
        groupService.makeGroup(groupDTO.getGroupTitle()); // 해당 메소드에서 그룹 생성 및 그룹장 지정
    }

    //그룹 목록 불러오기
    @PostMapping("/api/groupList")
    public List<GroupDTO> groupList() {
        //그룹 목록 프론트 전달
        //그룹 이름 및 아이디만 전달해서 세부 정보를 다시 불러올 것인지, 아예 처음부터 모든 정보를 가져와서 보여줄 것인지 토의 필요
        List<GroupDTO> a = groupService.groupList();
        System.out.println("a : " + a);
        return a;
    }

    //그룹 세부 정보 가져오기
    @PostMapping("/api/groupDetail")
    public void groupDetail(@RequestParam(name = "groupid") UUID groupid) {
        System.out.println("groupid : " + groupid);

        groupService.groupDetail(groupid);
    }

    //그룹 초대
    @PostMapping("/api/inviteGroup")
    public String inviteGroup(@RequestParam("inviteCode") int inviteCode) { //그룹 초대
        return "";
    }
}
