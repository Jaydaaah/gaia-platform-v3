import { PageProps, User } from "@/types";
import { ExamFile, ExamNotes, Message } from "@/types/Models";

export type ChatPageProps = PageProps<{
    exam_file: ExamFile;
    bot_name: string;
    messages?: (Message & { sender: User })[];
    note: ExamNotes | null;
}>;
