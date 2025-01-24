import { _decorator, Component, Node , EditBox} from 'cc';
const { ccclass, property } = _decorator;
@ccclass('LoginView')
export class LoginView extends Component {

    @property({ type: EditBox })
    private accountEditBox = null

    @property({ type: EditBox })
    private passEditBox = null
    start() {

    }

    checkInput(){
        if(this.accountEditBox.string == '' || this.passEditBox.string == ''){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "请输入账号密码")
            return false
        }
        return true
    }
    
    onClickLogin(){
        if(this.checkInput()){
            HttpManager.SendHttp(HttpManager.login_url ,
                JSON.stringify({
                    username : this.accountEditBox.string,
                    password : this.passEditBox.string,
                    device_name : cc.sys.platform,
                    device_id : PlantformManager.getDeviceId(),
                }))
        }
    }

    onClickReg(){
        if(this.checkInput()){
            HttpManager.SendHttp(HttpManager.register_url ,
                JSON.stringify({
                    username : this.accountEditBox.string,
                    password : this.passEditBox.string
                }))
        }
    }
}

