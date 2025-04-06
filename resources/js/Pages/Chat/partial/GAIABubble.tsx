import { useEffect, useMemo, useState } from "react";
import BotAvatar from "@/Components/Avatar/BotAvatar";
import { usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";

interface GAIABubbleProps {
    moveAside?: boolean;
}
export default function GAIABubble({ moveAside }: GAIABubbleProps) {
    const {
        props: { bot_name },
    } = usePage<ChatPageProps>();

    const [hide, setHide] = useState(false);

    useEffect(() => {
        if (!moveAside) {
            setHide(false);
        }
    }, [moveAside]);

    const botName = useMemo(() => {
        return bot_name.length ? bot_name : "Sara";
    }, [bot_name]);

    return (
        <div className={`chat chat-start text-xl md:max-w-[50vw]`}>
            <div className="chat-image avatar">
                <div className="w-28 rounded-full overflow-clip relative">
                    <div className="absolute p-4">
                        <BotAvatar className="w-full h-full" name={botName} />
                    </div>
                    <div className="w-full h-full bg-base-300" />
                </div>
            </div>
            <div
                onClick={() => !!moveAside && setHide((prev) => !prev)}
                className={`chat-bubble line-clamp-5 select-none ${
                    moveAside
                        ? `${
                              hide
                                  ? "opacity-20 -translate-x-[100%]"
                                  : "opacity-75"
                          }`
                        : "hover:scale-[102%]s"
                } transition-all duration-500`}
            >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
            </div>
        </div>
    );
}
