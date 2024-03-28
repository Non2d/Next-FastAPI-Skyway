"use client";
import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    margin: '10px',
    transform: CSS.Translate.toString(transform),
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.3)',
    backgroundColor: 'rgb(255,255,255)',
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

export default Draggable;
