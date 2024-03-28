// import React from 'react';
// // import { initializeFirebaseApp } from "@/lib/firebase";
// // import { getApp } from "firebase/app"
// // import { getDatabase, onChildAdded, push, ref } from "firebase/database";
// // import { FirebaseError } from "@firebase/util";
// import { useEffect, useState } from "react";
// import { CARD_CONTENT } from "@/lib/cardContent";

// import {
//     closestCenter,
//     closestCorners,
//     rectIntersection,
//     pointerWithin,
//     DndContext,
//     useDraggable,
//     UniqueIdentifier,
//     CollisionDetection as CollisionDetectionType,
//     Modifiers,
// } from '@dnd-kit/core';

// import {
//     Draggable,
//     DraggableOverlay,
//     Droppable,
//     GridContainer,
//     Wrapper,
// } from '../components';

// // Firebase周りを含めたカード関連の管理

// const DCard = () => {
//     return (
//         <>
//             カードのデザイン
//         </>
//     );
// };;

// // カードを表示するメインコンポーネント
// const ControlDCardList = () => {

//     const cards_holder = [1, 2]; // 6枚のカードを表示するための配列
//     return (
//         <>
//             <div className="card-list flex flex-row">
//                 {cards_holder.map((cardId) => (
//                     <DCard />
//                     //onClickではなく，Cardコンポーネントに直接contentを渡している．
//                 ))}
//             </div>
//         </>
//     );
// };

// export default ControlDCardList;

"use client";
import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import Draggable from './Draggable';
import Droppable from './Droppable';

function ControlDCardList() {
  const [parent, setParent] = useState([]);

  const handleDragEnd = ({ over }) => {
    if (over) {
      setParent(old => [...old, over.id]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="border">
        <Droppable id="droppable" >
          {parent.map(id => (
            <Draggable key={id} id={id}>
              {id === 'draggable' ? 'Go ahead, drag me.' : 'Please drag me.'}
            </Draggable>
          ))}
        </Droppable>
      </div>
      <div className="border">
        {!parent.includes('draggable') && (
          <Draggable id="draggable">
            Go ahead, drag me.
          </Draggable>
        )}
        {!parent.includes('draggable2') && (
          <Draggable id="draggable2">
            Please drag me.
          </Draggable>
        )}
      </div>
    </DndContext>
  );
}

export default ControlDCardList;