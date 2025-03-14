import { _decorator, Component, Node , Label} from 'cc';
import UIUtils from "db://assets/script/utils/UIUtils";
const { ccclass, property } = _decorator;

@ccclass('maiTop')
export class maiTop extends Component {
    @property(Label)
    public roleName: Label

    @property(Label)
    public roleLv: Label

    start() {
        this.refrehView();
    }

    refrehView(){
        this.roleName.string = PlayerModel.roleName
        this.roleLv.string = "Lv." + PlayerModel.roleLv
    }

    onClickRole(){
        UIUtils.getInst().OpenViewByUrl("rolebag/roleView")
    }

    onClickBag(){
        UIUtils.getInst().OpenViewByUrl("rolebag/roleBag")
    }

    onClickMail(){
        UIUtils.getInst().OpenViewByUrl("mail/mailView")
    }

    onClickSetting(){
        UIUtils.getInst().OpenViewByUrl("setting/settingView")
    }

    onClickTask(){
        UIUtils.getInst().OpenViewByUrl("task/TaskView")
    }
}

