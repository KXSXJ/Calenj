import {DateEventTag} from "../../calendar/eventTag";
import {SubNavProfile} from "../../../user/userSimpleProfile";
import {FriendList} from "../../friend/friendList";
import {useSelector} from "react-redux";
import {RootState} from "../../../../entities/redux";

export const MainSubNavItems: React.FC = () => {
    const {clickState} = useSelector((state: RootState) => state.main_subNavState)

    return (
        <>
            <SubNavProfile/>
            {clickState === 'calendar' && <DateEventTag/>}
            {clickState === 'friend' && <FriendList/>}

        </>
    )
}