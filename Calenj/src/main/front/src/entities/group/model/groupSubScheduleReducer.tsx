import {SubSchedule} from "../../reactQuery";

export type GroupSubScheduleAction =
    | { type: 'SET_INDEX'}
    | { type: 'SET_TITLE'; payload: {index:number, title: string}}
    | { type: 'SET_CONTENT'; payload: {index:number, content:string} }
    | { type: 'SET_DURATION'; payload: {index:number, duration: number} }
    | { type: 'SET_SUB_SCHEDULE_LIST'; payload:SubSchedule[]}
    ;

export const groupSubScheduleReducer = (state: SubSchedule[], action: GroupSubScheduleAction): SubSchedule[] => {
    switch (action.type) {
        case 'SET_INDEX':
            return state.map((item,idx)=>{
                return {...item, index :idx }
            })
        case 'SET_TITLE':
            return state.map((item, idx) =>
                idx === action.payload.index ? { ...item, subScheduleTitle: action.payload.title } : item
            );
        case 'SET_CONTENT':
            return state.map((item, idx) =>
                idx === action.payload.index ? { ...item, subScheduleContent: action.payload.content } : item
            );
        case 'SET_DURATION':
            return state.map((item, idx) =>
                idx === action.payload.index ? { ...item, subScheduleDuration: action.payload.duration ||0 } : item
            );
        case 'SET_SUB_SCHEDULE_LIST':
            return action.payload
        default:
            return state;
    }
};
