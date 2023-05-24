/// <reference types="node" />
import { BaseClient } from "./base-client";
/** 生成短设备信息 */
export declare function generateShortDevice(uin: number): {
    "--begin--": string;
    product: string;
    device: string;
    board: string;
    brand: string;
    model: string;
    wifi_ssid: string;
    bootloader: string;
    android_id: string;
    boot_id: string;
    proc_version: string;
    mac_address: string;
    ip_address: string;
    imei: string;
    incremental: number;
    "--end--": string;
};
/** 生成完整设备信息 */
export declare function generateFullDevice(d: ShortDevice | number): {
    display: string;
    product: string;
    device: string;
    board: string;
    brand: string;
    model: string;
    bootloader: string;
    fingerprint: string;
    boot_id: string;
    proc_version: string;
    baseband: string;
    sim: string;
    os_type: string;
    mac_address: string;
    ip_address: string;
    wifi_bssid: string;
    wifi_ssid: string;
    imei: string;
    android_id: string;
    apn: string;
    version: {
        incremental: number;
        release: string;
        codename: string;
        sdk: number;
    };
    imsi: Buffer;
    guid: Buffer;
    qImei16: string;
    qImei36: string;
};
export type ShortDevice = ReturnType<typeof generateShortDevice>;
export type Device = ReturnType<typeof generateFullDevice>;
/** 支持的登录设备平台 */
export declare enum Platform {
    Android = 1,
    aPad = 2,
    Watch = 3,
    iMac = 4,
    iPad = 5
}
export type Apk = typeof mobile;
declare const mobile: {
    id: string;
    app_key: string;
    name: string;
    version: string;
    ver: string;
    sign: Buffer;
    buildtime: number;
    appid: number;
    subid: number;
    bitmap: number;
    main_sig_map: number;
    sub_sig_map: number;
    sdkver: string;
    display: string;
    ssover: number;
};
export declare function getApkInfo(p: Platform): Apk;
export declare function requestQImei(this: BaseClient): Promise<void>;
export {};
