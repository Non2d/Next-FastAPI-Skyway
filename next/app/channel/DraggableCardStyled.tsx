// // import React from 'react';
// // // import { initializeFirebaseApp } from "@/lib/firebase";
// // // import { getApp } from "firebase/app"
// // // import { getDatabase, onChildAdded, push, ref } from "firebase/database";
// // // import { FirebaseError } from "@firebase/util";
// // import { useEffect, useState } from "react";
// // import { CARD_CONTENT } from "@/lib/cardContent";

// // import {
// //     closestCenter,
// //     closestCorners,
// //     rectIntersection,
// //     pointerWithin,
// //     DndContext,
// //     useDraggable,
// //     UniqueIdentifier,
// //     CollisionDetection as CollisionDetectionType,
// //     Modifiers,
// // } from '@dnd-kit/core';

// // import {
// //     Draggable,
// //     DraggableOverlay,
// //     Droppable,
// //     GridContainer,
// //     Wrapper,
// // } from '../components';

// // // Firebase周りを含めたカード関連の管理

// // const DCard = () => {
// //     return (
// //         <>
// //             カードのデザイン
// //         </>
// //     );
// // };;

// // // カードを表示するメインコンポーネント
// // const ControlDCardList = () => {

// //     const cards_holder = [1, 2]; // 6枚のカードを表示するための配列
// //     return (
// //         <>
// //             <div className="card-list flex flex-row">
// //                 {cards_holder.map((cardId) => (
// //                     <DCard />
// //                     //onClickではなく，Cardコンポーネントに直接contentを渡している．
// //                 ))}
// //             </div>
// //         </>
// //     );
// // };

// // export default ControlDCardList;

// import React, {useState} from 'react';
// import {
//   closestCenter,
//   closestCorners,
//   rectIntersection,
//   pointerWithin,
//   DndContext,
//   useDraggable,
//   UniqueIdentifier,
//   CollisionDetection as CollisionDetectionType,
//   Modifiers,
// } from '@dnd-kit/core';

// import {
//   Draggable,
//   DraggableOverlay,
//   Droppable,
//   GridContainer,
//   Wrapper,
// } from '../components';

// interface Props {
//   collisionDetection?: CollisionDetectionType;
//   containers?: string[];
//   modifiers?: Modifiers;
//   value?: string;
// }

// function DroppableStory({
//   containers = ['A'],
//   collisionDetection,
//   modifiers,
// }: Props) {
//   const [isDragging, setIsDragging] = useState(false);
//   const [parent, setParent] = useState<UniqueIdentifier | null>(null);

//   const item = <DraggableItem />;

//   return (
//     <DndContext
//       collisionDetection={collisionDetection}
//       modifiers={parent === null ? undefined : modifiers}
//       onDragStart={() => setIsDragging(true)}
//       onDragEnd={({over}) => {
//         setParent(over ? over.id : null);
//         setIsDragging(false);
//       }}
//       onDragCancel={() => setIsDragging(false)}
//     >
//       <Wrapper>
//         <Wrapper style={{width: 350, flexShrink: 0}}>
//           {parent === null ? item : null}
//         </Wrapper>
//         <GridContainer columns={2}>
//           {containers.map((id) => (
//             <Droppable key={id} id={id} dragging={isDragging}>
//               {parent === id ? item : null}
//             </Droppable>
//           ))}
//         </GridContainer>
//       </Wrapper>
//       <DraggableOverlay />
//     </DndContext>
//   );
// }

// interface DraggableProps {
//   handle?: boolean;
// }

// function DraggableItem({handle}: DraggableProps) {
//   const {isDragging, setNodeRef, listeners} = useDraggable({
//     id: 'draggable-item',
//   });

//   return (
//     <Draggable
//       dragging={isDragging}
//       ref={setNodeRef}
//       handle={handle}
//       listeners={listeners}
//       style={{
//         opacity: isDragging ? 0 : undefined,
//       }}
//     />
//   );
// }

// const BasicSetup = () => <DroppableStory />;
// // export default BasicSetup;

// const MultipleDroppables = () => (
//   <DroppableStory containers={['A']} />
// );
// export default MultipleDroppables;

// export const CollisionDetectionAlgorithms = () => {
//   const [{algorithm}, setCollisionDetectionAlgorithm] = useState({
//     algorithm: rectIntersection,
//   });

//   return (
//     <>
//       <DroppableStory
//         collisionDetection={algorithm}
//         containers={['A', 'B', 'C']}
//       />
//       <div
//         style={{
//           position: 'absolute',
//           bottom: 20,
//           left: 20,
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         <h3>Collision detection algorithm</h3>
//         <label>
//           <input
//             type="radio"
//             value="rectIntersection"
//             checked={algorithm === rectIntersection}
//             onClick={() =>
//               setCollisionDetectionAlgorithm({algorithm: rectIntersection})
//             }
//           />
//           Rect Intersection
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="closestCenter"
//             checked={algorithm === closestCenter}
//             onClick={() =>
//               setCollisionDetectionAlgorithm({algorithm: closestCenter})
//             }
//           />
//           Closest Center
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="closestCorners"
//             checked={algorithm === closestCorners}
//             onClick={() =>
//               setCollisionDetectionAlgorithm({algorithm: closestCorners})
//             }
//           />
//           Closest Corners
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="pointerWithin"
//             checked={algorithm === pointerWithin}
//             onClick={() =>
//               setCollisionDetectionAlgorithm({algorithm: pointerWithin})
//             }
//           />
//           Pointer Within
//         </label>
//       </div>
//     </>
//   );
// };
