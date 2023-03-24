import {YTError} from '../@types/types';
import {UISettings} from './ui-settings';

export interface YTConfig {
    clusters: Record<string, ClusterConfig>;
    cluster: string;
    isLocalCluster?: boolean;
    parameters: {
        interface: {
            version: string;
        };
        login: string;
        version: string;
    };
    environment?: 'development' | 'production' | 'farm' | 'localmode';
}

export type BatchResults<T extends Array<any>> = [...BatchFirst<T>, ...BatchRest<T>];

export type BatchFirst<T extends Array<any>> = T extends [first: infer F, ...rest: any]
    ? [BatchResultsItem<F>]
    : [];
export type BatchRest<T extends Array<any>> = T extends [first: any, ...rest: infer R]
    ? BatchResults<R>
    : [];

export interface BatchResultsItem<T = unknown> {
    error?: YTError;
    output?: T;
}

export type ClusterTheme =
    | 'grapefruit'
    | 'bittersweet'
    | 'sunflower'
    | 'grass'
    | 'mint'
    | 'aqua'
    | 'bluejeans'
    | 'lavander'
    | 'pinkrose'
    | 'lightgray'
    | 'mediumgray'
    | 'darkgray';

export interface ClusterConfig {
    id: string;
    name: string;
    theme: ClusterTheme;
    environment: 'development' | 'production' | 'prestable' | 'testing' | 'localmode';
    group?: string;
    primaryMaster?: {
        cellTag: number;
    };
    infra?: {
        preset: string;
        serviceId: number;
        environmentId: number;
    };
    proxy: string;
    hwOrder?: unknown;

    authentication?: 'none' | 'basic' | 'domain' | 'basic';
    secure?: boolean;
    description?: string;

    isLocalCluster?: boolean;
}

export interface SubRequest<K extends string, T extends BaseBatchParams> {
    command: K;
    parameters: T;
    setup?: unknown;
}

export interface BaseBatchParams {
    transaction_id?: string;
    ui_marker?: string;
}

export interface PathParams extends BaseBatchParams {
    path: string;
}

export interface PathAttrParams extends PathParams {
    attributes?: Array<string>;
    fields?: Array<string>;
}

export interface ExecuteBatchParams extends BaseBatchParams {
    requests: Array<BatchSubRequest>;
}

export interface CopyMoveParams extends BaseBatchParams {
    source_path: string;
    destination_path: string;
    preserve_account?: boolean;
}

export interface MergeParams extends BaseBatchParams {
    spec: {
        input_table_paths: Array<string>;
        output_table_path: string;
        force_transform?: boolean;
        sorted?: {mode: 'sorted'};
    };
}

export interface CheckPermissionsParams extends BaseBatchParams {
    user: string;
    path: string;
    permission: string;
}

export interface TransferPoolQuotaParams extends BaseBatchParams {
    source_pool: string;
    destination_pool: string;
    pool_tree: string;
    resource_delta: unknown;
}

export interface CheckAclParams extends BaseBatchParams {
    acl: Array<{permissions: Array<YTPermissionType>; subjects: Array<string>; action: 'allow'}>;
    user: string;
    permission: YTPermissionType;
}

export interface GetQueryParams extends BaseBatchParams {
    query_id: string;
    stage: string;
}
export type YTPermissionType = 'read' | 'write' | 'use' | 'mount';

export type BatchSubRequest =
    | SubRequest<'transfer_pool_resources', TransferPoolQuotaParams>
    | SubRequest<'mount_table' | 'unmount_table' | 'freeze_table' | 'unfreeze_table', PathParams>
    | SubRequest<'check_permission', CheckPermissionsParams>
    | SubRequest<'set' | 'remove', PathParams>
    | SubRequest<'get' | 'list', PathAttrParams>
    | SubRequest<'exists', PathParams>
    | SubRequest<'copy' | 'move', CopyMoveParams>
    | SubRequest<'merge', MergeParams>
    | SubRequest<'execute_batch', ExecuteBatchParams>
    | SubRequest<'check_permission_by_acl', CheckAclParams>
    | SubRequest<'get_query', GetQueryParams>;

export interface SettingsConfig {
    data: Record<string, unknown>;
    meta: {
        useRemoteSettings: boolean;
        errorMessage: any;
    };
}

export interface ConfigData {
    settings: SettingsConfig;
    ytApiUseCORS?: boolean;
    uiSettings?: UISettings;
    metrikaCounterId?: number;
    allowLoginDialog?: boolean;
    allowUserColumnPresets?: boolean;
}