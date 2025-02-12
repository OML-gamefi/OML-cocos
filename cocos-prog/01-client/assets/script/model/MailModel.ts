import EventSystem from "db://assets/script/utils/EventSystem";

class MailModel{
    public mails = []
    public init(){
        EventSystem.addListent("S2CMailAll" , function (a){
            this.mails = a["Mails"]
            EventSystem.send("refreshMailAll")
        } , this)
    }
}

let mailModel = new MailModel();
mailModel.init()
window["MailModel"] = mailModel;