import { PageProps } from "@/types";
import { ExamFile, Folder } from "@/types/Models";

export type DashboardPage = PageProps<{
    hierarchy: Folder[];
    folder_id: number | null;
    folder_name?: string;
    folders?: Folder[];
    files?: ExamFile[];
    parent_id: number | null;
}>;
