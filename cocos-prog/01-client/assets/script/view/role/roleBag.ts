import { _decorator, Component, Node , Label} from 'cc';
import {ScrollList} from "db://assets/script/utils/ScrollList";
import {TextureLoad} from "db://assets/script/utils/TextureLoad";
import EventSystem from "db://assets/script/utils/EventSystem";
import {roleBagRender} from "db://assets/script/view/role/roleBagRender";
const { ccclass, property } = _decorator;

@ccclass('roleBag')
export class roleBag extends Component {
    @property({type : ScrollList})
    private scrollList

    @property({type : Label})
    private chooseName

    @property({type : Label})
    private chooseInfo

    @property({type : TextureLoad})
    private chooseImg

    private chooseIndex = 0
    start() {
        this.refreshView();

        EventSystem.addListent("refreshItems" , function (){
            this.chooseIndex = 0
            this.refreshView();
        } , this)
    }

    refreshView(){
        this.scrollList.numItems = Math.max(ItemModel.bagItems.length , 40)

        this.refreshTouchPoint();
    }

    refreshTouchPoint(){
        if(ItemModel.bagItems[this.chooseIndex]){
            let itemId = ItemModel.bagItems[this.chooseIndex].id
            let itemCfg = ConfigManager.getItem("item" , itemId)

            this.chooseName.string = itemCfg["name_" + LanguageManager.language]
            this.chooseInfo.string = itemCfg["info_" + LanguageManager.language]
            this.chooseImg.Url = "res/texture/icon/" + itemCfg["icon"]
            this.chooseImg.node.active = true
        }else{
            this.chooseName.string = ""
            this.chooseInfo.string = ""
            this.chooseImg.node.active = false
        }
    }

    OnScrollList(a , b){
        let render = a.getComponent(roleBagRender)
        render.onRefresh(b)
    }

    OnClickRender(index){
        this.chooseIndex = index
        this.refreshTouchPoint();
    }
}

