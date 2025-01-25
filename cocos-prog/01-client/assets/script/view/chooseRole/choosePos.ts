import { _decorator, Component, Node , Label} from 'cc';
const { ccclass, property } = _decorator;
import {choosePosRender} from "./choosePosRender"

@ccclass('choosePos')
export class choosePos extends Component {

    @property([choosePosRender])
    public renders : choosePosRender[] = [];
    start() {

    }

    refreshNode(){

    }
}

