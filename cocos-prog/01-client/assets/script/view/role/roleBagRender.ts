import { _decorator, Component, Node } from 'cc';
import {TextureLoad} from "db://assets/script/utils/TextureLoad";
import {roleBag} from "db://assets/script/view/role/roleBag";
const { ccclass, property } = _decorator;

@ccclass('roleBagRender')
export class roleBagRender extends Component {

    @property({type : TextureLoad})
    private iconImg

    @property({type : Node})
    private itemNode

    @property({type : Node})
    private target

    private roleBag : roleBag

    private itemIndex = -1

    start() {
        this.roleBag = this.target.getComponent(roleBag)
    }

    onRefresh(index){
        if(ItemModel.bagItems[index]){
            this.itemNode.active = true

            let itemId = ItemModel.bagItems[index].id
            let itemCfg = ConfigManager.getItem("item" , itemId)
            this.iconImg.Url = "res/texture/icon/" + itemCfg["icon"]
        }else{
            this.itemNode.active = false
        }
        this.itemIndex = index
    }

    onClick(){
        if(ItemModel.bagItems[this.itemIndex]) {
            this.roleBag.OnClickRender(this.itemIndex);
        }
    }
}

