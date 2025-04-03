import { useState, useEffect, useRef } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

// Simulated AI responses
const aiResponses = [
    "Sure! Let me find that for you.",
    "Can you clarify what you mean?",
    "That’s an interesting question!",
    "I’ll need a moment to process that.",
    "Here's what I found...",
    "I’m not sure, but I can try!",
    "Let's break this down step by step.",
    "That’s a complex topic, but I’ll do my best.",
    "I appreciate your patience!",
    "Let me double-check that for you.",
];

// User Data
const users: Record<string, { avatar: string; direction: "start" | "end" }> = {
    "Obi-Wan Kenobi": {
        avatar: "https://ui-avatars.com/api/?name=Obi+Wan",
        direction: "end",
    },
    Anakin: {
        avatar: "https://ui-avatars.com/api/?name=Anakin",
        direction: "end",
    },
    Yoda: { avatar: "https://ui-avatars.com/api/?name=Yoda", direction: "end" },
    You: { avatar: "https://ui-avatars.com/api/?name=You", direction: "end" },
    "GAIA AI": {
        avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        direction: "start",
    },
};

interface ChatPageProps {
    subject: string; // Expecting the subject as a prop
}

export default function ChatPage({ subject }: ChatPageProps) {
    const [messages, setMessages] = useState([
        {
            sender: "Obi-Wan Kenobi",
            content: `Alam mo ba kung sino si ${subject}?`,
            time: "12:45",
        },
        {
            sender: "Anakin",
            content: `Oo, siya ang pambansang bayani ng Pilipinas, di ba?`,
            time: "12:46",
        },
        {
            sender: "Yoda",
            content: `${subject} ay matalino at maraming naiambag sa kalayaan ng bansa.`,
            time: "12:50",
        },
        {
            sender: "You",
            content: `Oo nga, siya ang may-akda ng Noli Me Tangere at El Filibusterismo.`,
            time: "12:52",
        },
        {
            sender: "GAIA AI",
            content: `Tama! At siya rin ay doktor, manunulat, at tagapagtanggol ng mga karapatan ng tao.`,
            time: "12:53",
        },
    ]);

    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll when messages update
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-focus input field
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const userMessage = {
            sender: "You",
            content: newMessage,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setNewMessage("");

        // Simulate AI Response
        setTimeout(() => {
            const aiMessage = {
                sender: "GAIA AI",
                content:
                    aiResponses[Math.floor(Math.random() * aiResponses.length)],
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
    };

    return (
        <Authenticated>
            <div className="flex flex-col h-screen bg-base-200 items-center">
                <div className="w-full max-w-7xl flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 rounded-box bg-primary text-primary-content flex justify-between items-center">
                        <h1 className="text-lg font-bold">Chat Room</h1>
                        <button className="btn btn-sm btn-error">
                            Leave Chat
                        </button>
                    </div>

                    {/* Topic Title */}
                    <div className="p-4 my-4 w-fit mx-auto">
                        <h2 className="text-2xl font-semibold">
                            Topic: {subject}
                        </h2>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, index) => {
                            const user = users[msg.sender] || {};
                            return (
                                <div
                                    key={index}
                                    className={`chat chat-${
                                        user.direction || "end"
                                    }`}
                                >
                                    <div className="chat-image avatar">
                                        <div className="w-10 rounded-full">
                                            <img
                                                src={user.avatar}
                                                alt={msg.sender}
                                            />
                                        </div>
                                    </div>
                                    <div className="chat-header">
                                        {msg.sender}{" "}
                                        <time className="text-xs opacity-50">
                                            {msg.time}
                                        </time>
                                    </div>
                                    <div className="chat-bubble">
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-base-300 fixed bottom-0 w-full max-w-7xl">
                        <div className="flex items-center space-x-4">
                            <input
                                ref={inputRef}
                                type="text"
                                className="input input-bordered input-primary w-full"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                            />
                            <button
                                className="btn btn-primary"
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
