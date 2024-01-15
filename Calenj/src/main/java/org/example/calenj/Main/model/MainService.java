package org.example.calenj.Main.model;

import lombok.RequiredArgsConstructor;
import org.example.calenj.Main.DTO.UserDTO;
import org.example.calenj.Main.JWT.JwtToken;
import org.example.calenj.Main.JWT.JwtTokenProvider;
import org.example.calenj.Main.Repository.Test2Repository;
import org.example.calenj.Main.Repository.UserRepository;
import org.example.calenj.Main.domain.Test2;
import org.example.calenj.Main.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MainService {
    @Autowired
    Test2Repository test2Repository;
    @Autowired
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;

    public void saveUser(User userInfo) {
        //유저 삽입 코드
        User user = User.builder()
                .accountid(userInfo.getAccountid()) //getter로 받은 데이터 사용
                .user_password(passwordEncoder.encode(userInfo.getUser_password())) //비밀번호 암호화
                .user_email(userInfo.getUser_email())
                .user_phone(userInfo.getUser_phone())
                .user_role(userInfo.getUser_role())
                .kakao_login(userInfo.isKakao_login())
                .naver_login(userInfo.isNaver_login())
                .user_join_date(userInfo.getUser_join_date())
                .withdrawed(userInfo.isWithdrawed())
                .build();

        userRepository.save(user);

        //------------위 코드와 아래의 코드는 같은 기능-------------------
        /*userRepository.save(User.builder()
                .account_id(userInfo.getAccount_id())
                .user_password(userInfo.getUser_password())
                .user_email(userInfo.getUser_email())
                .user_phone(userInfo.getUser_phone())
                .user_roll(userInfo.getUser_roll())
                .kakao_login(userInfo.isKakao_login())
                .naver_login(userInfo.isNaver_login())
                .user_join_date(userInfo.getUser_join_date())
                .withdrawed(userInfo.isWithdrawed())
                .build());*/
    }

    public int saveUser2(UserDTO userDTO) {
        //패스워드 암호화
        userDTO.setUser_password(passwordEncoder.encode(userDTO.getUser_password()));
        userRepository.save(userDTO.toEntity());
        return userDTO.toEntity().getUser_id();
    }

    public void saveTest2(Test2 test2Info) {
        //승재 삽입 코드
        Test2 test2 = Test2.builder()
                .account_id(test2Info.getAccount_id()) //getter로 받은 데이터 사용
                .user_password(test2Info.getUser_password())
                .build();
        test2Repository.save(test2);
        //------------위 코드와 아래의 코드는 같은 기능-------------------
        /*test2Repository.save(Test2.builder()
                .account_id(test2Info.getAccount_id())
                .user_password(test2Info.getUser_password())
                .build());*/

    }

    public void updateTest(Test2 test2Info) {
        //업데이트 테스트
        Test2 test2 = Test2.builder()
                .userid(test2Info.getUserid())
                .account_id(test2Info.getAccount_id())
                .user_password(test2Info.getUser_password())
                .build();
        test2Repository.save(test2);
        //------------위 코드와 아래의 코드는 같은 기능-------------------
        /*test2Repository.save(Test2.builder()
                .userid(test2Info.getUserid())
                .account_id(test2Info.getAccount_id())
                .user_password(test2Info.getUser_password())
                .build());*/
    }

    public void deleteTest(Test2 test2Info) {
        Test2 test2 = Test2.builder().userid(test2Info.getUserid()).build();
        //delete는 null체크와 새로 생성한 entity인지 확인 후 삭제 -> 바로 삭제
        test2Repository.delete(test2);
        //deletebyid 는 아이디 값으로 삭제 -> select 후 delete 실행 -> deleteById를 사용하면 entity를 조회할 필요 없음
        test2Repository.deleteById(test2Info.getUserid());
        //------------위 코드와 아래의 코드는 같은 기능-------------------
        //test2Repository.delete(Test2.builder().userid(1).account_id("moon11").build());
    }

    public void selectUser(User userInfo) {
        //select 테스트
        Optional<User> user = userRepository.findById(userInfo.getUser_id());
        String userResult = (user.isPresent() ? user.toString() : "정보가 없습니다");

        System.out.println(userResult);

    }

    public void selectTest2(Test2 test2Info) {
        //select 테스트
        Optional<Test2> test = test2Repository.findById(test2Info.getUserid()); //Optional을 사용하여 nullPointerException을 방지해줌을 알 수 있습니다.
        String testResult = (test.isPresent() ? test.toString() : "정보가 없습니다");

        System.out.println(testResult);
    }

    @Transactional
    public void login(String accountid, String password) {

        System.out.println("실행3");

        System.out.println(accountid + " " + password);

        // 1. Login ID/PW 를 기반으로 Authentication 객체 생성
        // 이때 authentication 는 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(accountid, password);
        System.out.println("authenticationToken : " + authenticationToken);
        System.out.println("실행4");

        // 2. 실제 검증 (사용자 비밀번호 체크)이 이루어지는 부분
        // authenticate 매서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드가 실행
        try {
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            // 이후의 코드...
            System.out.println("authentication.getCredentials() : " + authentication.getCredentials());
            System.out.println("실행5");

            // 3. 인증 정보를 기반으로 JWT 토큰 생성
            JwtToken tokenInfo = jwtTokenProvider.generateToken(authentication);
            System.out.println("tokenInfo : " + tokenInfo);
            System.out.println("실행6");
        } catch (AuthenticationException e) {
            e.printStackTrace();
        }


    }
}
