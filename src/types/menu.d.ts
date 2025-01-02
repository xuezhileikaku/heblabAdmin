export interface MenuItem {
    id: string;
    parentId: string | null;
    title: string;
    path: string;
    component: string;
    icon?: string;
    sort: number;
    hidden: boolean;
    permission?: string;
   }
   