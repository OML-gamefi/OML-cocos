import { _decorator, Component, Node ,Label , Animation , instantiate} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TipsView')
export class TipsView extends Component {
    @property({ type: Node })
    private tipsNode = null
    start() {
        this.tipsNode.active = false;
        EventSystem.addListent(AppConst.GameEventEnum.ShowTips , this.OnShopTips , this);
    }

    OnShopTips(a){
        let newtext = instantiate(this.tipsNode);
        newtext.active = true;
        this.node.addChild(newtext);

        let label = newtext.getChildByName("bg").getChildByName("tipTxt").getComponent(Label);
        label.string = a;

        let labelAnim = newtext.getComponent(Animation);
        labelAnim.on('finished', this.onfinished,  this);
    }

    onfinished(a , b){
        b._target.node.destroy()
    }
}

