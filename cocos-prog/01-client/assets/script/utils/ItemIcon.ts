import { _decorator, Component, Node , Label} from 'cc';
import {TextureLoad} from "db://assets/script/utils/TextureLoad";
const { ccclass, property } = _decorator;

@ccclass('ItemIcon')
export class ItemIcon extends Component {
    @property({type : Label})
    private num

    @property({type : TextureLoad})
    private icon

    @property({type : TextureLoad})
    private bg
    start() {

    }

    setItem(itemId , num = ""){
        let itemCfg = ConfigManager.getItem("item" , itemId)
        if(itemCfg){
            this.icon.Url = "res/texture/icon/" + itemCfg["icon"]

            if(this.num != null){
                this.num.string = num
            }
        }
    }
}

