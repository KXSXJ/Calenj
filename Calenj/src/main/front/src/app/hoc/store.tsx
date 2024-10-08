import {configureStore,createSelector} from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import thunkMiddleware from 'redux-thunk'//비동기 논리를 모두 사용하는 데 가장 일반적으로 사용되는 미들웨어
import createSagaMiddleware from 'redux-saga';
import { all } from "@redux-saga/core/effects"; // import all method
import {initializeStompChannel} from '../../entities/redux/model/module/StompMiddleware'
import emailValidationReducer from '../../entities/redux/model/slice/EmailValidationSlice';
import StompReducer, {updateStompState} from '../../entities/redux/model/slice/StompReducer';
import navigateReducer from '../../entities/redux/model/slice/NavigatgionSlice';
import subNavigateReducer from '../../entities/redux/model/slice/SubNavigationSlice';
import boardOptionReducer from '../../entities/redux/model/slice/BoardOptionSlice';
import dateEventTagReducer from '../../entities/redux/model/slice/DateEventTagSlice';
import calendarReducer from "../../entities/redux/model/slice/CalendarControllerSlice";
import UserDataReducer from "../../entities/redux/model/slice/UserNameStorageSlice";
import friendViewReducer from "../../entities/redux/model/slice/FriendViewSlice";
import onlineUserReducer from "../../entities/redux/model/slice/OnlineUserStorageSlice";
import MessageInputSizeReducer from "../../entities/redux/model/slice/InputSizeSlice";
import GroupScheduleReducer from "../../entities/redux/model/slice/GroupScheduleSlice";

function* rootSaga() {
    // all 함수는 여러 사가를 합쳐주는 역할을 한다.
    yield all([initializeStompChannel()]);
}

//여려 reducer를 묶는용 (dispatch함수 X)
const rootReducer = combineReducers({
  stomp: StompReducer,
  emailValidation: emailValidationReducer,
  navigateInfo:navigateReducer,
  subNavigation:subNavigateReducer,
  boardOption:boardOptionReducer,
  dateEventTag:dateEventTagReducer,
  calendarController : calendarReducer,
  userNameStorage : UserDataReducer,
  friendViewState :friendViewReducer,
  onlineStorage : onlineUserReducer,
  messageInputSize : MessageInputSizeReducer,
  groupSchedule :GroupScheduleReducer,
});


// 사가 미들웨어 생성
const sagaMiddleware = createSagaMiddleware();


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

export const sagaTask =sagaMiddleware.run(rootSaga);

//Client 실행 시 자동으로 바로 시작
export const sagaRefresh = ()=>{
  //stomp연결해제
  store.dispatch(updateStompState({isConnect:false}))

  setTimeout(()=>{
    sagaTask.cancel()
    sagaTask;//취소 후 재연결
  },50)
}


export default store;

