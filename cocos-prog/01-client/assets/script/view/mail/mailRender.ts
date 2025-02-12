import { _decorator, Component, Node , Label} from 'cc';
import {ItemIcon} from "db://assets/script/utils/ItemIcon";
import {mailView} from "db://assets/script/view/mail/mailView";
const { ccclass, property } = _decorator;

@ccclass('mailRender')
export class mailRender extends Component {
    @property({type : Label})
    private sendName

    @property({type : Label})
    private mailTitle

    @property({type : ItemIcon})
    private icon

    @property({type : Label})
    private endTime

    private data;
    private index;

    @property({type : Node})
    private parentNode

    @property({type : Node})
    private chooseNode

    onLoad(){

        this.mailView = this.parentNode.getComponent(mailView)
    }

    start() {
    }

    onRefresh(data , index){
        this.index = index
        this.data = data
        this.sendName.string = data["sender_name"]
        this.mailTitle.string = data["title"]

        this.endTime.string = TimeManager.second2hms(TimeManager.timeServer - data["send_time"]);

        //attachments [{"item_id": 1003, "quantity": 1}]
        let attachments = JSON.parse(data["attachments"])
        if(attachments && attachments.length > 0){
            this.icon.setItem(attachments[0]["item_id"])
        }

        this.chooseNode.active = this.index == this.mailView.chooseIndex
    }

    onClick(){
        this.mailView.OnClickRender(this.index)
    }
}

