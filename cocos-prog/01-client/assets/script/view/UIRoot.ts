import { _decorator, Component, Node , Canvas , sys , log} from 'cc';
// import * as cc from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIRoot')
export class UIRoot extends Component {
    @property({ type: Canvas })
    private Canvas = null;

    start() {
        cc.log(location.search)
        console.log("当前平台" + sys.platform)
        console.log("当前系统语言" + sys.language)

        let winSize = cc.winSize;
        log("适配比例 ： " + (winSize.height / winSize.width))
        if(winSize.height / winSize.width <= 1.8){
            // this.Canvas.fitHeight = true
            // this.Canvas.fitWidth = false
        }
    }

    // update(deltaTime: number) {
        
    // }
}

