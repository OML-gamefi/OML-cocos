import { _decorator, Component, Node , Canvas , sys , log} from 'cc';
// import * as cc from 'cc';
const { ccclass, property } = _decorator;

import UIUtils from "../utils/UIUtils";
import AppConst from "../utils/AppConst";

@ccclass('UIRoot')
export class UIRoot extends Component {
    @property({ type: Canvas })
    private Canvas = null;

    private nodeObjs = {};

    start() {
        AppConst.UIRoot = this;
        this.nodeObjs["GameScene"] = this.node.getChildByName("GameScene")
        this.nodeObjs["Cover"] = this.node.getChildByName("Cover")
        this.nodeObjs["Top"] = this.node.getChildByName("Top")
        this.nodeObjs["Bottom"] = this.node.getChildByName("Bottom")
        this.nodeObjs["Guide"] = this.node.getChildByName("Guide")
        this.nodeObjs["Wait"] = this.node.getChildByName("Wait")
        this.nodeObjs["Tips"] = this.node.getChildByName("Tips")

        log(this.nodeObjs)
        log(location.search)
        console.log("当前平台" + sys.platform)
        console.log("当前系统语言" + sys.language)

        let winSize = cc.winSize;
        let game_size = 720 / 1280
        let win_size = winSize.height / winSize.width
        log("设计比例 ：" + game_size)
        log("适配比例 ： " + win_size)
        if(win_size > game_size){
            let prog_scale = winSize.width / 1280;
            cc.log(prog_scale)
            this.node.scale = cc.v3(prog_scale , prog_scale , 1);
        }
    }
}

