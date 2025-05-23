import { PageProps, User } from "@/types";
import { ExamBot, ExamFile, ExamNotes, Message } from "@/types/Models";

export type ChatPageProps = PageProps<{
    exam_file: ExamFile & { shareable: User[] };
    bot: ExamBot;
    bot_last_message_content?: string;
    messages?: (Message & {
        sender: User;
        reply_from?: (Message & { sender: User })[];
    })[];
    note: (ExamNotes & { owner: User }) | null;
    user_context?: number;
    read_only: boolean;
    is_owner: boolean;
    other_users?: User[];
    has_rating: boolean;
}>;
