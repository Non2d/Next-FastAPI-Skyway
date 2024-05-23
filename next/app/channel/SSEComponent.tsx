// components/SSEComponent.js または SSEComponent.tsx (TypeScriptの場合)
import { useEffect, useState } from 'react';

const SSEComponent = () => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8080/rooms/sse2");

        eventSource.onmessage = function(event) {
            setMessages(prevMessages => [...prevMessages, event.data]);
            console.log('New event from server:', event.data);
        };

        // コンポーネントのアンマウント時に接続を閉じる
        return () => {
            eventSource.close();
        };
    }, []);

    // 最新の2-3件のメッセージを取得
    const recentMessages = messages.slice(-3);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Received Messages</h1>
            <div className="space-y-4">
                {recentMessages.map((msg, index) => (
                    <div key={index} className="p-4 bg-white shadow rounded-lg">
                        <p className="text-gray-700">{msg}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SSEComponent;
