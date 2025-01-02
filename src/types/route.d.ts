declare module 'vue-router' {
    interface RouteMeta {
        title?: string;
        icon?: string;
        permission?: string;
        hideMenu?: boolean;
    }
}