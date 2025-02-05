import { _decorator, Component, Node } from 'cc';
import UIUtils from "db://assets/script/utils/UIUtils";
const { ccclass, property } = _decorator;

@ccclass('maiTop')
export class maiTop extends Component {
    start() {

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
}

