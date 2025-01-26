import { _decorator, Component, Node , EditBox} from 'cc';
import EventSystem from "db://assets/script/utils/EventSystem";
import UIUtils from "db://assets/script/utils/UIUtils";
const { ccclass, property } = _decorator;
@ccclass('LoginView')
export class LoginView extends Component {

    @property({ type: EditBox })
    private accountEditBox = null

    @property({ type: EditBox })
    private passEditBox = null
    start() {
        EventSystem.addListent("PlayerEnterMap" , function (){
            UIUtils.getInst().CloseView(this)
        } , this)
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
            LoginModel.SendLogin(this.accountEditBox.string , this.passEditBox.string);
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

