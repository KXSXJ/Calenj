## 캘린제이(CalenJ)

### 프로젝트 소개
캘린더 및 실시간 채팅으로 개인 및 그룹 일정을 관리할 수 있는 사이트

개발 기간 : 2024/01 ~ 2024/09

팀 구성 : Front-end 1, Back-end 1

---

### 사용 기술 & 라이브러리 

#### _Back-end_
Spring Boot, JPA, Spring Security, Jwt, web-socket


#### _front-end_ 
JavaScript, TypeScript, React, React-query, Redux, Redux-saga, sockJs, StyledComponent




### 핵심 기술
+ Spring Security + JWT를 활용한 사용자 인증 구현
+  redux-sag + middleware를 활용한 웹 소켓 관리
+  fullCalendar + rrule 라이브러리를 활용한 일정 관리
+  react-query를 활용한 데이터 캐싱 및 관리
+  IntersectionObserver + react-infinity-query를 무한 스크롤 기능




### 담당한 부분
+  전체적인 화면UI 디자인 및 구현
+  FSD파일구조 채택, 컴포넌트 분리
+  redux-saga를 활용한 웹소켓 연결 및 데이터 파싱
+  fullCalender를 활용한 캘린더 기능제작
+  채팅 + 무한스크롤 구현
+  반응형 페이지 제작
  




---

### ⚠️ 트러블 슈팅

#### 웹소켓 연결 및 해제

🚨 발생한 문제 

  컴포넌트에 의존하지 않고 웹소켓을 연결 및 해제하는 코드를 작성해야 했습니다.  컴포넌트마다 반복적으로 웹소켓을 선언해 연결함으로써
   코드 중복이 발생했고, 하위 컴포넌트의 상태 관리가 어려웠습니다.


**해결방법**
redux-Saga와 Generator 함수를 사용해 웹소켓을 중앙에서 관리하고, redux-saga를 통한 데이터 파싱을 구현했습니다. 
제네레이터 함수를 통해 websocket publish/subscribe를 비동기 처리하였습니다.
이벤트 채널을 통한 구독을 설정해 효율적인 데이터 파싱을 구현했습니다.

```tsx
export function* initializeStompChannel(){
    const {payload} = yield take(SYNCHRONIZATION_STOMP)
    yield startStomp(payload.destination);
}
```




[git-code](https://github.com/KXSXJ/Calenj/blob/master/Calenj/src/main/front/src/entities/redux/model/module/StompMiddleware.tsx)

[redux-middleware 노션정리](https://www.notion.so/d3b9afa7480448ce9340a54a7aabbfca?v=8f87ec9d17fa4b39bf937e61ff5781f7&p=ca3a18b1197145918a2a884d3abaf859&pm=s)

[redux-saga 노션정리](https://www.notion.so/d3b9afa7480448ce9340a54a7aabbfca?v=8f87ec9d17fa4b39bf937e61ff5781f7&p=12bdb93d2b3444bfb00c0e6fe4d47520&pm=s)

💡**문제를 통해 알게 된 것**

제네레이터 함수를 통해 비동기 처리를 할 수 있게 되었으며 redux-saga를 통한 비동기 처리 및 데이터 파싱에 대해 깊게 이해할 수 있었습니다.
saga의 여러 effect를 활용하여 여러 Task를 관리 및 데이터 파싱을 할 수 있게 되었습니다.

---
#### 반복적인 랜더링링

🚨 발생한 문제 

상위 컴포넌트의 업데이트로 인해 하위 컴포넌트의 불필요한 렌더링이 발생했습니다.

**해결 방법**
메시지 화면의 Input창과 메시지의 데이터를 보여주는 스크롤 박스를 분리하며 useMemo를 사용하여 중복 랜더링을 방지했습니다.

💡문제를 통해 알게 된 것

> 컴포넌트 및 훅 분리의 필요성, useMemo의 사용 방법과 시기를 알게 됐습니다.
>  또한 하나의 기능만 수행하는 컴포넌트 분리의 필요성을 알게 되었습니다.


---

## 🎯 결과 및 성과

- **Redux-Saga**와 제너레이터 함수 활용으로 복잡한 비동기 작업을 효율적으로 관리하는 방법을 배웠습니다.
- **useMemo**와 컴포넌트 분리를 통해 성능을 최적화하고, 재랜더링 문제를 해결했습니다.
- **Throttle/Debounce**를 활용해 성능 개선과 불필요한 API 호출을 방지하는 방법을 익혔습니다.
- 커스텀 훅을 제작하고 사용하는 방법을 익혔습니다.
- git을 통한 버전 관리 및 fork를 통한 협업을 할 수 있게 됐습니다.
