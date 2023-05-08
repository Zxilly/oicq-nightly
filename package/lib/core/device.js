"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestQImei = exports.getApkInfo = exports.Platform = exports.generateFullDevice = exports.generateShortDevice = void 0;
const crypto = __importStar(require("crypto"));
const crypto_1 = require("crypto");
const constants_1 = require("./constants");
const axios_1 = __importDefault(require("axios"));
const base_client_1 = require("./base-client");
const secret = "ZdJqM15EeO2zWc08";
const ws = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const rsaKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEIxgwoutfwoJxcGQeedgP7FG9
qaIuS0qzfR8gWkrkTZKM2iWHn2ajQpBRZjMSoSf6+KJGvar2ORhBfpDXyVtZCKpq
LQ+FLkpncClKVIrBwv6PHyUvuCb0rIarmgDnzkfQAqVufEtR64iazGDKatvJ9y6B
9NMbHddGSAUmRTCrHQIDAQAB
-----END PUBLIC KEY-----`;
function generateImei() {
    let sum = 0;
    let final = "";
    for (let i = 0; i < 14; i++) {
        let toAdd = Math.floor(Math.random() * 10);
        final += toAdd;
        if ((i + 1) % 2 == 0) {
            toAdd *= 2;
            if (toAdd >= 10) {
                toAdd = (toAdd % 10) + 1;
            }
        }
        sum += toAdd;
    }
    sum = (sum * 9) % 10;
    final += sum;
    return final;
}
/** 生成短设备信息 */
function generateShortDevice(uin) {
    const hash = (0, constants_1.md5)(String(uin));
    const hex = hash.toString("hex");
    return {
        "--begin--": "该设备由账号作为seed固定生成，账号不变则永远相同",
        product: "MRS4S",
        device: "HIM188MOE",
        board: "MIRAI-YYDS",
        brand: "OICQX",
        model: "Konata 2020",
        wifi_ssid: `TP-LINK-${uin.toString(16)}`,
        bootloader: "U-boot",
        android_id: `OICQX.${hash.readUInt16BE()}${hash[2]}.${hash[3]}${String(uin)[0]}`,
        boot_id: hex.substr(0, 8) + "-" + hex.substr(8, 4) + "-" + hex.substr(12, 4) + "-" + hex.substr(16, 4) + "-" + hex.substr(20),
        proc_version: `Linux version 4.19.71-${hash.readUInt16BE(4)} (konata@takayama.github.com)`,
        mac_address: `00:50:${hash[6].toString(16).toUpperCase()}:${hash[7].toString(16).toUpperCase()}:${hash[8].toString(16).toUpperCase()}:${hash[9].toString(16).toUpperCase()}`,
        ip_address: `10.0.${hash[10]}.${hash[11]}`,
        imei: generateImei(),
        incremental: hash.readUInt32BE(12),
        "--end--": "修改后可能需要重新验证设备",
    };
}
exports.generateShortDevice = generateShortDevice;
/** 生成完整设备信息 */
function generateFullDevice(d) {
    if (typeof d === "number")
        d = generateShortDevice(d);
    return {
        display: d.android_id,
        product: d.product,
        device: d.device,
        board: d.board,
        brand: d.brand,
        model: d.model,
        bootloader: d.bootloader,
        fingerprint: `${d.brand}/${d.product}/${d.device}:10/${d.android_id}/${d.incremental}:user/release-keys`,
        boot_id: d.boot_id,
        proc_version: d.proc_version,
        baseband: "",
        sim: "T-Mobile",
        os_type: "android",
        mac_address: d.mac_address,
        ip_address: d.ip_address,
        wifi_bssid: d.mac_address,
        wifi_ssid: d.wifi_ssid,
        imei: d.imei,
        android_id: d.android_id,
        apn: "wifi",
        version: {
            incremental: d.incremental,
            release: "10",
            codename: "REL",
            sdk: 29,
        },
        imsi: (0, crypto_1.randomBytes)(16),
        guid: (0, constants_1.md5)(Buffer.concat([Buffer.from(d.imei), Buffer.from(d.mac_address)])),
        qImei16: "",
        qImei36: ""
    };
}
exports.generateFullDevice = generateFullDevice;
// ----------
/** 支持的登录设备平台 */
var Platform;
(function (Platform) {
    Platform[Platform["Android"] = 1] = "Android";
    Platform[Platform["aPad"] = 2] = "aPad";
    Platform[Platform["Watch"] = 3] = "Watch";
    Platform[Platform["iMac"] = 4] = "iMac";
    Platform[Platform["iPad"] = 5] = "iPad";
})(Platform = exports.Platform || (exports.Platform = {}));
//android
const mobile = {
    id: "com.tencent.mobileqq",
    app_key: '0S200MNJT807V3GE',
    name: "A8.9.35.10440",
    version: "8.9.35.10440",
    ver: "8.9.35",
    sign: Buffer.from([0xA6, 0xB7, 0x45, 0xBF, 0x24, 0xA2, 0xC2, 0x77, 0x52, 0x77, 0x16, 0xF6, 0xF3, 0x6E, 0xB6, 0x8D]),
    buildtime: 1676531414,
    appid: 16,
    subid: 537153294,
    bitmap: 150470524,
    main_sig_map: 16724722,
    sub_sig_map: 0x10400,
    sdkver: "6.0.0.2535",
    display: "Android",
    ssover: 19,
};
//watch
const watch = {
    id: "com.tencent.qqlite",
    app_key: '0S200MNJT807V3GE',
    name: "A2.0.8",
    version: "2.0.8",
    ver: "2.0.8",
    sign: Buffer.from([0xA6, 0xB7, 0x45, 0xBF, 0x24, 0xA2, 0xC2, 0x77, 0x52, 0x77, 0x16, 0xF6, 0xF3, 0x6E, 0xB6, 0x8D]),
    buildtime: 1559564731,
    appid: 16,
    subid: 537065138,
    bitmap: 16252796,
    main_sig_map: 16724722,
    sub_sig_map: 0x10400,
    sdkver: "6.0.0.2365",
    display: "Watch",
    ssover: 5
};
//iMac
const hd = {
    id: "com.tencent.minihd.qq",
    app_key: '0S200MNJT807V3GE',
    name: "A5.8.9",
    version: "5.8.9",
    ver: "5.8.9",
    sign: Buffer.from([170, 57, 120, 244, 31, 217, 111, 249, 145, 74, 102, 158, 24, 100, 116, 199]),
    buildtime: 1595836208,
    appid: 16,
    subid: 537128930,
    bitmap: 150470524,
    main_sig_map: 1970400,
    sub_sig_map: 66560,
    sdkver: "6.0.0.2433",
    display: "iMac",
    ssover: 12
};
const apklist = {
    [Platform.Android]: mobile,
    [Platform.aPad]: {
        ...mobile,
        subid: 537152242,
        display: 'aPad'
    },
    [Platform.Watch]: watch,
    [Platform.iMac]: hd,
    [Platform.iPad]: {
        ...mobile,
        subid: 537151363,
        sign: hd.sign,
        name: 'A8.9.33.614',
        version: 'A8.9.33.614',
        ver: '8.9.33',
        sdkver: '6.0.0.2433',
        display: 'iPad'
    },
};
function getApkInfo(p) {
    return apklist[p] || apklist[Platform.Android];
}
exports.getApkInfo = getApkInfo;
async function requestQImei() {
    if (!this.apk.app_key)
        return;
    const payload = genRandomPayloadByDevice.call(this);
    const cryptKey = (0, constants_1.randomString)(16, "abcdef1234567890");
    const ts = Date.now();
    const nonce = (0, constants_1.randomString)(16, "abcdef1234567890");
    const publicKey = crypto.createPublicKey(rsaKey);
    const key = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(cryptKey)).toString("base64");
    const param = aesEncrypt(JSON.stringify(payload), cryptKey);
    const body = {
        key: key,
        params: param,
        time: ts,
        nonce: nonce,
        sign: (0, constants_1.md5)(key + param + ts + nonce + secret).toString("hex"),
        extra: ""
    };
    try {
        const { data } = await axios_1.default.post("https://snowflake.qq.com/ola/android", body, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (data?.code !== 0)
            return;
        const { q16, q36 } = JSON.parse(aesDecrypt(data.data, cryptKey));
        this.device.qImei16 = q16;
        this.device.qImei36 = q36;
    }
    catch (err) {
        this.emit("internal.verbose", "qImei获取失败", base_client_1.VerboseLevel.Warn);
    }
}
exports.requestQImei = requestQImei;
/**
 * aes编码，icqq
 * @param src
 * @param key
 */
function aesEncrypt(src, key) {
    const cipher = crypto.createCipheriv("aes-128-cbc", key, key.substr(0, 16));
    const encrypted = cipher.update(src);
    return Buffer.concat([encrypted, cipher.final()]).toString("base64");
}
/**
 * ase解码，icqq
 * @param encryptedData
 * @param key
 */
function aesDecrypt(encryptedData, key) {
    let encryptedText = Buffer.from(encryptedData, 'base64');
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, key.substring(0, 16));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
function genRandomPayloadByDevice() {
    const reserved = {
        "harmony": "0",
        "clone": "0",
        "containe": "",
        "oz": "UhYmelwouA+V2nPWbOvLTgN2/m8jwGB+yUB5v9tysQg=",
        "oo": "Xecjt+9S1+f8Pz2VLSxgpw==",
        "kelong": "0",
        "uptimes": (0, constants_1.formatDateTime)(new Date(), "yyyy-MM-dd hh:mm:ss"),
        "multiUser": "0",
        "bod": this.device.board,
        "brd": this.device.brand,
        "dv": this.device.device,
        "firstLevel": "",
        "manufact": this.device.brand,
        "name": this.device.model,
        "host": "se.infra",
        "kernel": this.device.fingerprint,
    };
    let timeMonth = (0, constants_1.formatDateTime)(new Date(), "yyyy-MM-") + "01";
    let rand1 = Math.floor(Math.random() * 899999) + 100000;
    let rand2 = Math.floor(Math.random() * 899999999) + 100000000;
    let beaconId = "";
    for (let i = 1; i <= 40; i++) {
        switch (i) {
            case 1:
            case 2:
            case 13:
            case 14:
            case 17:
            case 18:
            case 21:
            case 22:
            case 25:
            case 26:
            case 29:
            case 30:
            case 33:
            case 34:
            case 37:
            case 38:
                beaconId += `k${i}:${timeMonth}${rand1}.${rand2}`;
                break;
            case 3:
                beaconId += "k3:0000000000000000";
                break;
            case 4:
                beaconId += `k4:${(0, constants_1.randomString)(16, "123456789abcdef")}`;
                break;
            default:
                beaconId += `k${i}:${Math.floor(Math.random() * 10000)}`;
        }
        beaconId += ";";
    }
    return {
        "androidId": this.device.android_id,
        "platformId": 1,
        "appKey": this.apk.app_key,
        "appVersion": this.apk.version,
        "beaconIdSrc": beaconId,
        "brand": this.device.brand,
        "channelId": "2017",
        "cid": "",
        "imei": this.device.imei,
        "imsi": "",
        "mac": "",
        "model": this.device.model,
        "networkType": "unknown",
        "oaid": "",
        "osVersion": `Android ${this.device.version.release},level ${this.device.version.sdk}`,
        "qimei": "",
        "qimei36": "",
        "sdkVersion": "1.2.13.6",
        "audit": "",
        "userId": "{}",
        "packageId": this.apk.id,
        "deviceType": this.apk.display === "aPad" ? "Pad" : "Phone",
        "sdkName": "",
        "reserved": JSON.stringify(reserved),
    };
}
