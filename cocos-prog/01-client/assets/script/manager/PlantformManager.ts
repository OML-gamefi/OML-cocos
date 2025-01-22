
//平台管理
export default class PlantformManager{
    public static getDeviceId(){
        // let deviceId = cc.sys.browserVersion;
        //
        // if (!deviceId) {
        //     // 如果获取不到UUID，可以尝试其他方式生成一个
        //     deviceId = 'userDefinedId' + Math.random().toString(36).substr(2, 9);
        // }
        return "deviceId"
    }
}

window["PlantformManager"] = PlantformManager;