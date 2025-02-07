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

    @property({type : Node})
    private renderEventTarget

    @property
    private renderEventComp = ""

    @property
    public renderEventFunc = ""

    private renderEvent

    private currentValue = 0

    onInit(){
        this.progressBar = this.node.getComponent(ProgressBar)
        this.uiTransform = this.node.getComponent(UITransform)
        this.currentValue = this.progressBar.progress
    }

    start() {
        if(this.progressBar == null){
            this.onInit()
        }
        if(this.renderEventTarget != null && this.renderEventComp != "" && this.renderEventFunc != ""){
            this.renderEvent = new Component.EventHandler();
            this.renderEvent.target = this.renderEventTarget;
            this.renderEvent.component = this.renderEventComp;
            this.renderEvent.handler = this.renderEventFunc;
        }

        if(this.touchNode){
            this.touchNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
    }

    public onEvent(event){
        if(this.progressBar == null){
            this.onInit()
        }
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
        this.currentValue = newValue;

        this.setPointNode();
    }

    private setPointNode(){
        if(this.pointNode != null){
            this.pointNode.x = this.uiTransform.width * this.progressBar.progress
        }
    }

    public setCurrentValue(val){
        if(this.progressBar == null){
            this.onInit()
        }
        this.currentValue = val

        this.progressBar.progress = val
        this.setPointNode();
    }

    onTouchStart(event){
        this.onEvent(event);
    }

    onTouchMove(event){
        this.onEvent(event);
    }

    onTouchEnd(){
        //推送事件
        if (this.renderEvent) {
            Component.EventHandler.emitEvents([this.renderEvent] , this.currentValue);
        }
    }
}

