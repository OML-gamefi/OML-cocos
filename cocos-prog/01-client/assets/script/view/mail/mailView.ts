import { _decorator, Component, Node , Label} from 'cc';
import EventSystem from "db://assets/script/utils/EventSystem";
import {ScrollList} from "db://assets/script/utils/ScrollList";
import {roleBagRender} from "db://assets/script/view/role/roleBagRender";
import {mailRender} from "db://assets/script/view/mail/mailRender";
import {ItemIcon} from "db://assets/script/utils/ItemIcon";
const { ccclass, property } = _decorator;

@ccclass('mailView')
export class mailView extends Component {
    private chooseIndex = 0;

    @property({type : ScrollList})
    private scrollList

    @property({type : Label})
    private sendName

    @property({type : Label})
    private mailTitle

    @property({type : Label})
    private mailInfo

    @property({type : Node})
    private rewardAllBtn

    @property({type : Node})
    private deleteBtn

    @property({type : [ItemIcon]})
    private rewards : ItemIcon[] = [];

    @property({type : Node})
    private rewardBtn;

    @property({type : Node})
    private isReward;
    start() {
        WebSocketManager.SendData(JSON.stringify({
            C2SMaillAll :{
                Token : LoginModel.token
            }
        }));

        EventSystem.addListent("refreshMailAll" , this.refreshView , this)
        this.refreshView();
    }

    refreshView(){
        if(!MailModel.mails){
            MailModel.mails = []
        }
        if(MailModel.mails){
            this.scrollList.numItems = MailModel.mails.length
        }else {
            this.scrollList.numItems = 0;
        }

        let mailData = MailModel.mails[this.chooseIndex]
        if(mailData){
            this.sendName.string = mailData["sender_name"]
            this.mailTitle.string = mailData["title"]
            this.mailInfo.string = mailData["content"]

            let attachments = mailData["attachments"]
            if(attachments && JSON.parse(attachments).length > 0){
                this.rewardBtn.active = mailData["status"] != "CLAIMED"
                this.isReward.active = mailData["status"] == "CLAIMED"
            }else{
                this.rewardBtn.active = false
                this.isReward.active = false
            }
        }else{
            this.sendName.string = ""
            this.mailTitle.string = ""
            this.mailInfo.string = ""

            this.rewardBtn.active = false
            this.isReward.active = false
        }
        let attachments = mailData ? JSON.parse(mailData["attachments"]) : []
        for(let r = 0 ; r < this.rewards.length ; r++){
            if(attachments[r]){
                this.rewards[r].node.active = true
                this.rewards[r].setItem(attachments[r]["item_id"] , attachments[r]["quantity"])
            }else{
                this.rewards[r].node.active = false
            }
        }

        this.deleteBtn.active = MailModel.mails.length > 0;
        let mails = []
        for(let m = 0 ; m < MailModel.mails.length ; m++){
            if(MailModel.mails[m]["status"] != "CLAIMED"){
                let attachments = MailModel.mails[m]["attachments"]
                if(attachments && JSON.parse(attachments).length > 0){
                    mails.push(MailModel.mails[m]["id"])
                }
            }
        }
        this.rewardAllBtn.active = mails.length > 0;
    }

    DeleteAll(){
        let mails = []
        for(let m = 0 ; m < MailModel.mails.length ; m++){
            let attachments = MailModel.mails[m]["attachments"]
            if(MailModel.mails[m]["status"] == "CLAIMED"){
                mails.push(MailModel.mails[m]["id"])
            }
            if(!attachments || JSON.parse(attachments).length <= 0){
                mails.push(MailModel.mails[m]["id"])
            }
        }
        if(mails.length > 0){
            WebSocketManager.SendData(JSON.stringify({
                C2SMailDelete :{
                    Token : LoginModel.token,
                    Mails : mails
                }
            }));
        }
    }

    RewardAll(){
        let mails = []
        for(let m = 0 ; m < MailModel.mails.length ; m++){
            if(MailModel.mails[m]["status"] != "CLAIMED"){
                let attachments = MailModel.mails[m]["attachments"]
                if(attachments && JSON.parse(attachments).length > 0){
                    mails.push(MailModel.mails[m]["id"])
                }
            }
        }
        if(mails.length > 0){
            WebSocketManager.SendData(JSON.stringify({
                C2SMailReward :{
                    Token : LoginModel.token,
                    Mails : mails
                }
            }));
        }
    }

    Reward(){
        let mailData = MailModel.mails[this.chooseIndex]
        WebSocketManager.SendData(JSON.stringify({
            C2SMailReward :{
                Token : LoginModel.token,
                Mails : [mailData["id"]]
            }
        }));
    }

    OnScrollList(a , b){
        let render = a.getComponent(mailRender)
        render.onRefresh(MailModel.mails[b] , b)
    }

    OnClickRender(index){
        this.chooseIndex = index
        this.refreshView();
    }
}

