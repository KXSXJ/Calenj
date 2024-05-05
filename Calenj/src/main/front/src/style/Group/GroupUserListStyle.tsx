import styled from 'styled-components';

export const groupUserList_Container_width = 250;
export const GroupUserList_Container = styled.div`
    width: ${groupUserList_Container_width}px;
    font-size: 13px;
`
export const UserProfile = styled.img<{ isOnline: boolean }>`
    border: ${({isOnline}) => isOnline ? 'green' : 'gray'} 3px inset;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    margin-right: 10px;
`