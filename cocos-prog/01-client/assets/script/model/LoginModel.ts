
class LoginModel{
    public token = null
    public account_id = null
    public username = null

    public init(){

    }

    public onLoginSuccess(data){
        this.token = data["data"].token
        this.account_id = data["data"].account_id
        this.username = data["data"].username

        if(!data["data"]["has_character"]){
            UIUtils.getInst().OpenViewByUrl("chooseRole/chooseRole")
            UIUtils.getInst().CloseViewByUrl("login/LoginView")
        }else{
            WebSocketManager.linkSocket();
        }
        // HttpManager.SendGetHttp(HttpManager.characters , this.GetHttpUserVal());
        // HttpManager.SendGetHttp(HttpManager.servers , {});
    }

    public SendLogin(username , password){
        HttpManager.SendHttp(HttpManager.login_url ,
            JSON.stringify({
                username : username,
                password : password,
                device_name : cc.sys.platform,
                device_id : PlantformManager.getDeviceId(),
            }))
    }

    public GetHttpUserVal(){
        let data = {};
        data["token"] = this.token;
        data["device-id"] = PlantformManager.getDeviceId();
        data["device-name"] = cc.sys.platform;
        data["service-code"] = "game"
        return data
    }
}

let loginModel = new LoginModel();
loginModel.init();
window["LoginModel"] = loginModel;