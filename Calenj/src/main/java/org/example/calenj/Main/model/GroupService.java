package org.example.calenj.Main.model;

import lombok.RequiredArgsConstructor;
import org.example.calenj.Main.DTO.Group.GroupDTO;
import org.example.calenj.Main.DTO.Group.GroupDetailDTO;
import org.example.calenj.Main.DTO.Group.GroupNoticeDTO;
import org.example.calenj.Main.DTO.Group.GroupUserDTO;
import org.example.calenj.Main.Repository.Group.GroupRepository;
import org.example.calenj.Main.Repository.Group.Group_NoticeRepository;
import org.example.calenj.Main.Repository.Group.Group_UserRepository;
import org.example.calenj.Main.Repository.UserRepository;
import org.example.calenj.Main.domain.Group.GroupEntity;
import org.example.calenj.Main.domain.Group.GroupNoticeEntity;
import org.example.calenj.Main.domain.Group.GroupUserEntity;
import org.example.calenj.Main.domain.UserEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupService {


    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final Group_UserRepository group_userRepository;
    private final GlobalService globalService;
    private final Group_NoticeRepository groupNoticeRepository;


    //그룹 만들기
    public void makeGroup(String groupTitle) {

        LocalDate today = LocalDate.now();

        UserDetails userDetails = globalService.extractFromSecurityContext(); // SecurityContext에서 유저 정보 추출하는 메소드

        // 유저 이름으로 그룹 생성/
        GroupEntity groupEntity = GroupEntity.builder()
                .groupTitle(groupTitle)
                .groupCreated(String.valueOf(today))
                .groupCreater(userDetails.getUsername())
                .build();

        groupRepository.save(groupEntity);

        UserEntity userEntity = userRepository.findByUserEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));

        // 생성한 유저 역할 -> 관리자 로 지정해서 그룹 유저 테이블 저장
        GroupUserEntity groupUserEntity = GroupUserEntity.builder()
                .role(GroupUserEntity.GroupRoleType.Host)
                .group(groupEntity)
                .user(userEntity)
                .build();

        group_userRepository.save(groupUserEntity);
    }

    //그룹 목록 가져오기
    public List<GroupDTO> groupList() {
        UserDetails userDetails = globalService.extractFromSecurityContext();
        String userEmail = userDetails.getUsername();
        List<GroupDTO> groupEntities = groupRepository.findByUserEntity_UserEmail(userEmail).orElseThrow(() -> new RuntimeException("그룹을 찾을 수 없습니다."));
        return groupEntities;
    }


    //그룹 세부 정보 가져오기
    public Optional<GroupDetailDTO> groupDetail(UUID groupId) {
        Optional<GroupDTO> groupOptional = groupRepository.findGroupById(groupId);
        if (groupOptional.isPresent()) {
            GroupDTO groupDTO = groupOptional.get();
            List<GroupUserDTO> groupUsers = group_userRepository.findGroupUsers(groupDTO.getGroupId());
            // GroupDetailDTO 생성 -> 이유는 모르겠지만 두 엔티티를 따로 불러와서 DTO로 만들어줘야 함.
            // 아니면 생성자가 없다는 오류가 생긴다. (TODO 이유 찾아봐야함)
            GroupDetailDTO groupDetailDTO = new GroupDetailDTO(
                    groupDTO.getGroupId(),
                    groupDTO.getGroupTitle(),
                    groupDTO.getGroupCreated(),
                    groupDTO.getGroupCreater(),
                    groupUsers
            );
            return Optional.of(groupDetailDTO);
        } else {
            return Optional.empty();
        }
    }

    //그룹 공지 생성
    public void makeNotice(String NoticeTitle, String NoticeContent, UUID groupId) {

        LocalDate today = LocalDate.now();

        UserDetails userDetails = globalService.extractFromSecurityContext(); // SecurityContext에서 유저 정보 추출하는 메소드

        GroupEntity groupEntity = groupRepository.findByGroupId(groupId).orElseThrow(() -> new UsernameNotFoundException("해당하는 그룹을 찾을수 없습니다"));

        GroupNoticeEntity groupNoticeEntity = GroupNoticeEntity.GroupNoticeBuilder()
                .noticeTitle(NoticeTitle)
                .noticeContent(NoticeContent)
                .noticeCreated(String.valueOf(today))
                .noticeCreater(userDetails.getUsername())
                .group(groupEntity)
                .build();

        UserEntity userEntity = userRepository.findByUserEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));

        // 생성한 유저 역할 -> 관리자 로 지정해서 그룹 유저 테이블 저장
        GroupUserEntity groupUserEntity = GroupUserEntity.builder()
                .role(GroupUserEntity.GroupRoleType.Host)
                .group(groupEntity)
                .user(userEntity)
                .build();

        groupNoticeRepository.save(groupNoticeEntity);
    }

    public List<GroupNoticeDTO> groupNoticeList(UUID groupId) {

        List<GroupNoticeDTO> groupNoticeDTOS = groupNoticeRepository.findGroupNotice(groupId).orElseThrow(() -> new RuntimeException("공지를 찾을 수 없습니다."));
        return groupNoticeDTOS;
    }

    public void joinGroup(UUID groupId) {
        //유저를 그룹에 추가하는 코드
        UserDetails userDetails = globalService.extractFromSecurityContext(); // SecurityContext 에서 유저 정보 추출하는 메소드
        GroupEntity groupEntity = groupRepository.findByGroupId(groupId).orElseThrow(() -> new UsernameNotFoundException("해당하는 그룹을 찾을수 없습니다"));
        UserEntity userEntity = userRepository.findByUserEmail(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));

        // 생성한 유저 역할 -> 멤버로 지정해서 그룹 유저 테이블 저장
        GroupUserEntity groupUserEntity = GroupUserEntity.builder()
                .role(GroupUserEntity.GroupRoleType.Member)
                .group(groupEntity)
                .user(userEntity)
                .build();

        group_userRepository.save(groupUserEntity);
    }
}
