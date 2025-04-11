import { PageProps } from "@/types";
import { ExamContext } from "@/types/Models";

export type UploadPage = PageProps<{
    folder_id: number | null;
    filename: string;
    context: ExamContext;
}>;
