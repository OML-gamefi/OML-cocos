import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ViewCtrl')
export class ViewCtrl extends Component {
    @property
    private Hierarchy = "Cover";

    @property
    private closeTime = 0.5;    

    private onClose = false;

    private Prefab = null;

    start() {
        this.scheduleOnce(function (){
            this.onClose = true
        } , this.closeTime)
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

