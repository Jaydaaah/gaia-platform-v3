import { PageProps } from "@/types";
import { Folder } from "@/types/Models";

export type DashboardPage = PageProps<{
    hierarchy: Folder[];
    parent_id?: number;
    folder_name?: string;
    folders?: Folder[];
}>;
