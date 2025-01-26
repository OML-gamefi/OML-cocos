import { _decorator, Component, Node , EditBox} from 'cc';
import EventSystem from "db://assets/script/utils/EventSystem";
import UIUtils from "db://assets/script/utils/UIUtils";
const { ccclass, property } = _decorator;

@ccclass('chooseRole')
export class chooseRole extends Component {
    @property({ type: Node })
    private raceNode = null

    @property({ type: Node })
    private posNode = null

    private chooseRace = 0;
    private choosePos = 0;

    @property({ type: EditBox })
    private nameEditBox = null
    start() {
        this.refreshView();

        EventSystem.addListent("PlayerEnterMap" , function (){
            UIUtils.getInst().CloseView(this)
        } , this)
    }

    refreshView() {
        this.raceNode.active = this.chooseRace == 0
        this.posNode.active = this.chooseRace > 0
    }

    onClickRace(a , b){
        this.chooseRace = parseInt(b);
        let choosePos = this.posNode.getComponent("choosePos")
        choosePos.refreshNode(this.chooseRace);
        this.refreshView();
    }

    onClickNation(nationId){

        if(this.nameEditBox.string == ''){
            EventSystem.send(AppConst.GameEventEnum.ShowTips , "请输入角色名")
            return false
        }
        this.choosePos = nationId
        let userVal = LoginModel.GetHttpUserVal()
        userVal["Content-Type"] = "application/json"
        HttpManager.SendHttp(HttpManager.create_url ,
            JSON.stringify({
                race : this.chooseRace,
                location_id : this.choosePos,
                name : this.nameEditBox.string,
            }) , userVal)
    }
}

