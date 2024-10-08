import styled from "styled-components";

import exp from "node:constants";
import {PointColor2, TextColor, ThemeColor2, ThemeColor3} from "./SharedStyled";


export const FriendList_Container = styled.div`
    width: calc(100% - 20px);
    border-radius: 5px;
    padding: 10px;
`

export const FriendListCount_Container =styled.div`
    height: 40px;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px solid ${TextColor}20;
`
export const FriendListUL = styled.ul`
    padding: 0;
`

export const FriendListView = styled.li<{$isClick?:boolean}>`
    padding: 10px;
    height: 45px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    background-color: ${props=> props.$isClick ? `${ThemeColor3}77`: "transparent"};
    &:hover {
        background-color: ${ThemeColor3}77;
    }
`
export const Friend_ProfilePlace = styled.div`
    display: flex;
    align-items: center;
`
export const Friend_ImagePlace = styled.div`
    width: 40px;
    height: 40px;
    margin: 0 10px 0 0;
    border-radius: 50%;
    border: 2px inherit ${ThemeColor3};
    background-color: white;
`
export const Friend_TextPlace = styled.div`
    width: auto;

`
export const Friend_NamePlace = styled.div`
    width: auto;
    font-size: 15px;
`

export const Friend_DatePlace = styled.div`
    width: auto;
    font-size: 13px;
    color: ${PointColor2};

`

export const Friend_ResponseBtn = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${ThemeColor3};
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    font-size: 15px;
`

export const Friend_Hr = styled.hr`
    background-color: ${TextColor}20;
    border: 0;
    height: 1px;
    margin: 0;
`


export const FriendListIcon_Container = styled.button`
    width: 35px;
    height: 35px;
    background-color: ${ThemeColor3};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-inline: 10px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    &:active{
        background-color: ${ThemeColor2};
    }
`