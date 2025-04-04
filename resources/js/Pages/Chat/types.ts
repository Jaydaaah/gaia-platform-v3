import { PageProps, User } from "@/types";
import { ExamFile, Message } from "@/types/Models";

export type ChatPageProps = PageProps<{
    exam_file: ExamFile;
    messages?: (Message & { sender: User })[];
}>;
