import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

let HierarchyType = cc.Enum({
    GameScene: 'GameScene',
    Cover: "Cover",
    Top: "Top",
    Bottom: "Bottom",
    Guide: "Guide",
    Wait: "Wait",
    Tips: "Tips",
});

@ccclass('ViewCtrl')
export class ViewCtrl extends Component {

    @property({
        type: cc.Enum(HierarchyType),
        displayName: "层级"
    })

    // @property
    public Hierarchy = "Cover";

    @property
    private closeTime = 0.5;    

    private onClose = false;

    private Prefab = null;

    start() {
        this.scheduleOnce(function (){
            this.onClose = true
        } , this.closeTime)

        this.Hierarchy = HierarchyType.Hierarchy
    }

    onDestroy()
    {
        if(this.Prefab != null)
        {
            this.Prefab.decRef();
        }
    }

    onClickClose(){
        if(this.onClose){
            UIUtils.getInst().CloseView(this)
        }
    }
}

