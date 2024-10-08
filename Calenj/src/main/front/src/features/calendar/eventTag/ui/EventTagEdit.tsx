import {EventTagEdit_Container, EventTagItem_Container} from "./EventTagEditStyled";
import {useEffect, useRef, useState} from "react";
import {
    deleteDateEventTag,
    updateTagColor
} from "../../../../entities/redux/model/slice/DateEventTagSlice";
import {ColorSelector} from "../../../../shared/ui/ColorSelector";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../entities/redux";
import axios, {AxiosResponse} from "axios";

interface TagEditProps {
    id: string,
    top: number,
}

export const EventTagEdit: React.FC<TagEditProps> = ({id, top}) => {
    const [colorModal, setColorModal] = useState<boolean>(false);
    const {dynamicEventTag} = useSelector((state: RootState) => state.dateEventTag)
    const dispatch = useDispatch()
    const changeColor = (color: string) => {
        dispatch(updateTagColor({tagId: id, color: color}));
    }
    const deleteTag = () => {
        axios.post('api/deleteTag', {id})
            .then(() => {
                window.alert('태그를 삭제했습니다.')
                dispatch(deleteDateEventTag({tagId:id}))
            });
    }
    return (
        <EventTagEdit_Container $top={top-5} $colorChange={colorModal}>
            {!(dynamicEventTag[id].defaultTag) &&
                <EventTagItem_Container onClick={deleteTag}>
                    삭제하기
                </EventTagItem_Container>
            }
            <EventTagItem_Container $colorChange={colorModal} onClick={() => setColorModal(prev => !prev)}>
                태그 색 지정
            </EventTagItem_Container>
            {colorModal && <ColorSelector color={dynamicEventTag[id].color} changeColor={changeColor}/>}
        </EventTagEdit_Container>

    )
}