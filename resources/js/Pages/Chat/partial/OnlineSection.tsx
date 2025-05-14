import { MdPeopleAlt } from "react-icons/md";
import Dropdown from "@/Components/Dropdown/Dropdown";
import DropdownContent from "@/Components/Dropdown/DropdownContent";
import { Deferred, usePage } from "@inertiajs/react";
import { ChatPageProps } from "../types";
import { useEffect, useMemo, useRef, useState } from "react";
import Loading from "@/Components/Loading/Loading";
import Avatar from "@/Components/Avatar/Avatar";
import echo from "@/echo";
import Filter from "@/Components/Filter/Filter";
import { toast } from "react-toastify";
import { Broadcaster } from "laravel-echo";

const TOAST_SUPPRESSION_WINDOW = 1000;

interface PresenceUser {
    id: number;
    name: string;
}

export default function OnlineSection() {
    const {
        props: {
            exam_file,
            other_users,
            auth: { user },
        },
    } = usePage<ChatPageProps>();

    const [online, setOnline] = useState<number[]>([]);
    const [filter, setFilter] = useState<string | null>(null);

    const users = useMemo(() => {
        if (Array.isArray(other_users)) {
            return [user, ...other_users].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        }
        return [];
    }, [other_users, user]);

    const displayUsers = useMemo(() => {
        if (filter == "online") {
            return users.filter(({ id }) => online.includes(id));
        } else if (filter == "offline") {
            return users.filter(({ id }) => !online.includes(id));
        }
        return users;
    }, [users, filter, online]);

    const [echoPresence, setEchoPresence] = useState<
        Broadcaster["pusher"]["presence"] | undefined
    >(undefined);

    const lastLeaveTimeout = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const lastLeaveTimestamps = useRef<Map<number, number>>(new Map());

    useEffect(() => {
        const echo_presence = echo.join(`chat-window.online.${exam_file.id}`);
        setEchoPresence(echo_presence);

        return () => {
            echo.leave(`chat-window.online.${exam_file.id}`);
            setEchoPresence(undefined);
        };
    }, [exam_file]);

    useEffect(() => {
        if (echoPresence) {
            echoPresence.here((users: PresenceUser[]) => {
                if (Array.isArray(users)) {
                    const list_ids = users
                        .map(({ id }) => id)
                        .filter((id) => typeof id == "number");
                    setOnline(list_ids);
                }
            });
        }
    }, [echoPresence]);

    useEffect(() => {
        if (echoPresence) {
            echoPresence.joining((user: PresenceUser) => {
                const now = Date.now();
                const lastLeftAt = lastLeaveTimestamps.current.get(user.id);
                const lastTimeout = lastLeaveTimeout.current.get(user.id);

                const shouldSuppress =
                    lastLeftAt && now - lastLeftAt < TOAST_SUPPRESSION_WINDOW;

                if (!shouldSuppress) {
                    toast(`${user.name} has joined the room.`, {
                        type: "info",
                    });
                } else {
                    clearTimeout(lastTimeout);
                }

                setOnline((prev) => {
                    if (!prev.includes(user.id)) {
                        return [...prev, user.id];
                    }
                    return prev;
                });
            });
        }
    }, [echoPresence]);

    useEffect(() => {
        if (echoPresence) {
            echoPresence.leaving((user: PresenceUser) => {
                const now = Date.now();
                lastLeaveTimestamps.current.set(user.id, now);

                const timeout = setTimeout(() => {
                    toast(`${user.name} has left the room.`, {
                        type: "warning",
                    });
                }, 1000);
                lastLeaveTimeout.current.set(user.id, timeout);

                setOnline((prev) => {
                    return prev.filter((id) => id != user.id);
                });
            });
        }
    }, [echoPresence]);

    useEffect(() => {
        if (echoPresence) {
            echoPresence.error((error: any) => {
                console.error("Presence channel error:", error);
            });
        }
    }, [echoPresence]);

    return (
        <>
            <Dropdown className="dropdown-end">
                <summary className="btn m-1">
                    <MdPeopleAlt /> <span>{online.length}</span>
                </summary>
                <DropdownContent
                    className="w-72 z-50 bg-base-300 rounded-box p-6"
                    doNotWrap
                >
                    <h2 className="text-md text-center mb-3">
                        People in this Chat Room
                    </h2>
                    <div>
                        <Deferred
                            data={"other_users"}
                            fallback={
                                <div className="flex justify-center">
                                    <Loading />
                                </div>
                            }
                        >
                            <div className="bg-base-200 rounded-box shadow-md h-96 overflow-y-auto px-2">
                                <div className="p-2">
                                    <Filter
                                        name="status_filter"
                                        options={[
                                            {
                                                label: "Online",
                                                value: "online",
                                            },
                                            {
                                                label: "Offline",
                                                value: "offline",
                                            },
                                        ]}
                                        onFilterChange={(selected) =>
                                            setFilter(selected)
                                        }
                                        value={filter}
                                    />
                                </div>
                                {displayUsers.map(({ id, name }) => (
                                    <div
                                        key={id}
                                        className="flex items-center gap-3 py-2 border-b border-base-300"
                                    >
                                        <div className="relative w-10 h-10">
                                            <div className="rounded-full overflow-hidden">
                                                <Avatar name={name} />
                                            </div>
                                            {online.includes(id) && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-200" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {name}
                                            {id == user.id && (
                                                <span className="font-thin">
                                                    {" "}
                                                    (You)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Deferred>
                    </div>
                </DropdownContent>
            </Dropdown>
        </>
    );
}
