
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

        HttpManager.SendGetHttp(HttpManager.characters , this.GetHttpUserVal());
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