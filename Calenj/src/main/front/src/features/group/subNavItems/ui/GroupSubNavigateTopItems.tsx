import {
    SubNavigateTopBar_Container,
    SubNavigateTopBar_Content_Container,
    SubNavigateTopBar_EventSelecter_Container,
    SubNavigateTopBar_leftContent, SubNavigateTopBar_rightContent_item
} from "./GroupSubNavigationStyle";
import {SubNavigationSelectBox} from "./SubNavigationSelectBox";
import {useEffect, useReducer, useRef, useState} from "react";
import {FullScreen_div} from "../../../../shared/ui/SharedStyled";
import {useClickOutSideCheck} from "../../../../shared/model/useClickOutSideCheck";

interface subNavigationTopProps{
    groupTitle:string,
}
export const GroupSubNavigateTopItems:React.FC<subNavigationTopProps> = ({groupTitle})=>{
    const [showEventSelector, setShowEventSelector] = useReducer((prev)=>!prev,false);
    const selectBox = useClickOutSideCheck(showEventSelector, setShowEventSelector)

    return(
        <SubNavigateTopBar_Container ref={selectBox} $isClick={showEventSelector} >
            <SubNavigateTopBar_Content_Container>
                <FullScreen_div onClick={setShowEventSelector} style={{display:"flex"}}>
                    <SubNavigateTopBar_leftContent>
                        {groupTitle}
                    </SubNavigateTopBar_leftContent>
                    <SubNavigateTopBar_EventSelecter_Container>
                        {showEventSelector ?
                            <SubNavigateTopBar_rightContent_item>
                                <i className="bi bi-x"></i>
                            </SubNavigateTopBar_rightContent_item> :
                            <SubNavigateTopBar_rightContent_item>
                                <i className="fi fi-rr-angle-small-down" style={{marginTop:'8px'}}></i>
                            </SubNavigateTopBar_rightContent_item>
                        }
                    </SubNavigateTopBar_EventSelecter_Container>
                </FullScreen_div>
            </SubNavigateTopBar_Content_Container>
            {showEventSelector && <SubNavigationSelectBox/>}
        </SubNavigateTopBar_Container>

    )
}
