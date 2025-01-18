
export default class HttpManager{
    public static ip = "http://18.141.164.252:8021"
    public static login_url = "/api/auth/login" //登录
    public static characters = "/api/user/characters" //获取角色列表
    public static servers = "/api/auth/servers" //服务器列表

    public static SendGetHttp(url , headers){
        url = HttpManager.ip + url
        fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            // headers: {
                // "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            // },
            headers : headers ,
            // redirect: "follow", // manual, *follow, error
            // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: body, // body data type must match "Content-Type" header
        }).then((response: Response) => {
            return response.text()
        }).then((value) => {
            console.log(value);
            HttpManager.parseReq(value , url);
        })
    }

    public static SendHttp(url , body){
        url = HttpManager.ip + url
        fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: body, // body data type must match "Content-Type" header
        }).then((response: Response) => {
            return response.text()
        }).then((value) => {
            console.log(value);
            HttpManager.parseReq(value , url);
        })
    }


    public static parseReq(value , url){
        let jsonVal = JSON.parse(value)
        if(jsonVal["code"] == 400){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "请求参数错误")
        }
        if(jsonVal["code"] == 401){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "token无效")
        }
        if(jsonVal["code"] == 404){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "用户不存在")
        }
        if(jsonVal["code"] == 1001){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "账号不存在")
        }
        if(jsonVal["code"] == 1002){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "账号已禁用")
        }
        if(jsonVal["code"] == 1003){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "密码错误")
        }
        if(jsonVal["code"] == 1007){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "登录失败（其他原因）")
        }
        if(jsonVal["code"] == 2003){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "角色数量达到上限")
        }
        if(jsonVal["code"] == 2004){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "角色名已存在")
        }
        if(jsonVal["code"] == 200){
            cc.log(url)
            if(url == HttpManager.ip + HttpManager.login_url){
                LoginModel.onLoginSuccess(jsonVal);
            }
            if(url == HttpManager.ip + HttpManager.characters){
                PlayerModel.loginPlayer(jsonVal);
            }
        }
    }
}

window["HttpManager"] = HttpManager;