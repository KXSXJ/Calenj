import {
    SubNavigateItem_Container,
    SubNavigateItem_Content, SubNavigateItem_Icon,
} from "./GroupSubNavigationStyle";
import {useSelector} from "react-redux";
import {RootState} from "../../../../entities/redux";
import {SubNavProps} from '../model/types';
import {useEffect} from "react";


export const SubNavigationButton:React.FC<SubNavProps> = ({subItem,subItemsHandler}) =>{
    const {clickState,param} = useSelector((state:RootState) => state.subNavigation.group_subNavState)

    useEffect(() => {
        console.log(param)
    }, []);
    return(
        <SubNavigateItem_Container
            $isClick={clickState===subItem}
            onClick={()=>subItemsHandler(subItem)}>
            <SubNavigateItem_Icon>
                {subItem==="그룹일정" && <i className="fi fi-ss-calendar" style={{marginTop: '4px'}}></i>}
                {subItem==="투표" && <i className="fi fi-ss-vote-yea" style={{marginTop: '4px'}}></i>}
                {subItem==="공지" && <i className="fi fi-ss-megaphone" style={{marginTop: '4px'}}></i>}

            </SubNavigateItem_Icon>
            <SubNavigateItem_Content>
                {subItem}
            </SubNavigateItem_Content>
        </SubNavigateItem_Container>
    )
}

