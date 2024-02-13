package org.example.calenj.Main.domain.Group;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity(name = "`Group`")
@NoArgsConstructor(access = AccessLevel.PROTECTED) //기본 생성자를 생성하며, 영속성을 지키기 위해 Protected 설정
@AllArgsConstructor //전체 필드에 대한 생성자를 생성하여 @Builder를 사용
@Builder // 빌더
@Getter
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "DTYPE") //자식테이블을 구분할 구분자 컬럼이름을 지어준다.
@ToString
public class GroupEntity {
    //a
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private int group_id;

    private String group_created;
    private String group_title;
    private String group_creater; //SecurityContext 에서 값 빼오기


    @OneToMany(mappedBy = "group") //사용하는 쪽이 one 대응이 many
    private List<Group_UserEntity> members;//Group_UserEntity에서 목록으로 가져오기
}




