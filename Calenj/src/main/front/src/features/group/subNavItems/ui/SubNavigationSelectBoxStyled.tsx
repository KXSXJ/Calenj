import styled from 'styled-components';
import {BackGroundColor, PointColor, SubScreenColor, TextColor} from "../../../../shared/ui/SharedStyled";


export const SelectorText_Container = styled.div`
    height: 100%;
    width: 85%;
    align-content: center;
    margin-left: 5px;
    color: ${PointColor};
`

export const SelectorIcon_Container = styled.div`
    height: 100%;
    width: 15%;
    align-content: center;
    text-align: center;
    color: ${PointColor};
    margin-top: 2px;
`

export const SelectItem_Container = styled.div`
    width: 196px;
    background-color: ${BackGroundColor};
    position: fixed;
    top: 60px;
    left: 81px; //SideNavigation width 72px + subNavigation padding: 10px
    padding: 8px;
    border-radius: 2px;
    border: 1px solid ${TextColor}20;
    z-index: 10;
`
export const Btn_ItemSelector = styled.div`
    background-color: transparent;
    height: 30px;
    width: 100%;
    font-weight: 550;
    font-size: 15px;
    letter-spacing: -1px;
    display: flex;
    flex-direction: row;
    border-radius: 2px;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: ${PointColor};
        font-weight: 0;

        ${SelectorIcon_Container} {
            color: ${TextColor};
        }

        ${SelectorText_Container} {
            color: ${TextColor};
        }
    }
`
