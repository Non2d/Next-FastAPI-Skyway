"use client";
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    margin: "10px 0",
    width: '100%',
    height: '200px',
    border: '3px rgb(240,240,240) solid',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isOver ? 'rgba(255,255,255, 0.5)' : 'rgba(255, 255, 255, 0)', // lightgreen and white with 50% opacity
    transition: 'background-color 0.3s ease'
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export default Droppable;