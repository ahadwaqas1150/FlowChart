import React, { useContext, useEffect, useRef, useState } from 'react'
import DeleteButton from './DeleteButton';
import { db } from './appwite/databases';
import Spinner from '../icons/Spinner';
import { setNewOffset , autoGrow , setZIndex, bodyParser} from './util';
import { NoteContext } from './context/NoteContext';
const NoteCard = ({ note }) => {
    const { setSelectedNote } = useContext(NoteContext);
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);
    const body = bodyParser(note.body);
    const [position,setPosition] = useState(bodyParser(note.position))
    const colors = bodyParser(note.colors)
    const textAreaRef = useRef(null)

    let mousestartPos = {x:0, y:0}
    const cardRef = useRef(null)


    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);
    
    
    const mouseDown =(e) => {
        if (e.target.className === "card-header") {
        setZIndex(cardRef.current);
        mousestartPos.x = e.clientX
        mousestartPos.y = e.clientY
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
        setSelectedNote(note);
        }
    }
    const mouseMove = (e) => {
        const mouseMoveDir = {
            x: mousestartPos.x - e.clientX,
            y: mousestartPos.y - e.clientY,
        }
        mousestartPos.x = e.clientX
        mousestartPos.y = e.clientY

        const newPosition = setNewOffset(cardRef.current,mouseMoveDir)
        setPosition(newPosition)
    }
    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current); //{x,y}
        saveData("position", newPosition);
    };
    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };
    const handleKeyUp = async () => {
        setSaving(true);
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
     
        
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    return <div
    ref={cardRef}
        className='card'
        style={{
            backgroundColor: colors.colorBody,
            left:`${position.x}px`,
            top:`${position.y}px`,
        }}
        >
        <div className="card-header" 
        onMouseDown = {mouseDown}
        style={{
            backgroundColor: colors.colorHeader,
        }}
        
        >
            <DeleteButton noteId={note.$id} />
            {saving && (
            <div className="card-saving">
                <Spinner color={colors.colorText} />
                <span style={{ color: colors.colorText }}>
                    Saving...
                </span>
            </div>
        )}
        </div>
    <div className="note-body">
        <textarea
        onKeyUp={handleKeyUp}
        onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);}}
        ref={textAreaRef}
        defaultValue={body}
        style={{color:colors.colorText}}
        onInput={() => {
            autoGrow(textAreaRef);
    }}
        ></textarea>
    </div>
    </div>;
};

export default NoteCard
