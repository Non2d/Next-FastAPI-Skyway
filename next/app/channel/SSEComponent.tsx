import { useEffect, useState } from 'react';

const SSEComponent = () => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8000/events");

        eventSource.onmessage = function(event) {
            setMessages(prevMessages => [...prevMessages, event.data]);
            console.log('New event from server:', event.data);
        };

        // コンポーネントのアンマウント時に接続を閉じる
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h1>Received Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default SSEComponent;