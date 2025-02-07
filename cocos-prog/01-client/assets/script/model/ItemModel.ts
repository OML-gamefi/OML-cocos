import EventSystem from "db://assets/script/utils/EventSystem";

class ItemModel{
    public items = {}
    public bagItems = []

    public init(){
        EventSystem.addListent("S2CItem" , function (a){
            this.items = a["Items"]

            this.bagItems = [];
            for(let i in this.items){
                if(parseInt(i) > 0){
                    this.bagItems.push({
                        id : i,
                        num : this.items[i]["num"]
                    })
                }
            }

            EventSystem.send("refreshItems")
        } , this)
    }
}

let iModel = new ItemModel();
iModel.init();
window["ItemModel"] = iModel;