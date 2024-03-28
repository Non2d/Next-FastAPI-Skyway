import React from 'react';
import { initializeFirebaseApp } from "@/lib/firebase";
import { getDatabase, onChildAdded, push, ref } from "firebase/database";
import { FirebaseError } from "@firebase/util";
import { useEffect, useState } from "react";
import { CARD_CONTENT } from "@/lib/cardContent";

// Firebase周りを含めたカード関連の管理

initializeFirebaseApp();

interface CardProps {
    contentNum: number;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ contentNum }) => {
    const handleClick = () => {
        try {
            const db = getDatabase();
            const cardsRef = ref(db, 'cards');
            push(cardsRef, contentNum);
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e);
            }
        }
    };
    return (
        <div
            // カードのデザイン
            className="card bg-white cursor-pointer border border-gray-300 rounded-lg p-4 m-2 w-64 h-48"
            onClick={handleClick}
        >
            <p className="text-3xl font-bold">{CARD_CONTENT[contentNum]}</p>
        </div>
    );
};

// カードを表示するメインコンポーネント
const ControlCardList = () => {
    const [cards, setCards] = useState<{ content: string }[]>([])
    useEffect(() => {
        try {
            const db = getDatabase()
            const dbRef = ref(db, 'cards')
            return onChildAdded(dbRef, (snapshot) => {
                const data = String(snapshot.val() ?? '')
                setCards((prev) => [...prev, { content: data }])
            })
        } catch (e) {
            if (e instanceof FirebaseError) {
                console.error(e)
            }
            return
        }
    }, [])

    const cards_holder = [3,4,5]; // 6枚のカードを表示するための配列
    return (
        <>
            <div className="card-list flex flex-row">
                <h1 className="text-4xl font-bold text-black">Now Selected:</h1>
                <h1 className="text-4xl font-bold text-black">{cards.length > 0 ? CARD_CONTENT[parseInt(cards[cards.length - 1].content)] : 'No cards available'}</h1>
            </div>
            <div className="card-list flex flex-row">
                {cards_holder.map((cardId) => (
                    <Card key={cardId} contentNum={cardId} onClick={() => {}} />
                    //onClickではなく，Cardコンポーネントに直接contentを渡している．
                ))}
            </div>
        </>
    );
};

export default ControlCardList;