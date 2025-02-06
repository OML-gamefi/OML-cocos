import { _decorator, Component, Node , UITransform , Vec3 , ProgressBar} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchProgressBar')
export class TouchProgressBar extends Component {

    private progressBar : ProgressBar
    private uiTransform : UITransform

    @property({ type: Node })
    private touchNode : Node

    @property({ type: Node })
    private pointNode : Node
    start() {
        this.progressBar = this.node.getComponent(ProgressBar)
        this.uiTransform = this.node.getComponent(UITransform)

        if(this.touchNode){
            this.touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    public onEvent(event){
        const locationUI = event.touch.getUILocation();
        const uiSpaceWorldPos = new Vec3(locationUI.x, locationUI.y, 0);
        let pos = new Vec3(this.node.x , this.node.y)
        this.uiTransform.convertToNodeSpaceAR(uiSpaceWorldPos , pos)
        let x =  pos.x
        let newValue = x / this.uiTransform.width
        if(newValue < 0){
            newValue = 0
        }
        if(newValue > 1){
            newValue = 1
        }
        this.progressBar.progress = newValue

        this.setPointNode();
    }

    private setPointNode(){
        if(this.pointNode != null){
            this.pointNode.x = this.uiTransform.width * this.progressBar.progress
        }
    }

    public setCurrentValue(val){
        this.currentValue = val

        this.setPointNode();
    }

    onTouchStart(event){
        this.onEvent(event);
    }

    onTouchMove(event){
        this.onEvent(event);
    }

    onTouchEnd(){

    }
}

