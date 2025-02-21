import { _decorator, Component, Node , Label} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('topItem')
export class topItem extends Component {
    @property
    private isStamina = false

    @property({type : Label})
    private showLabel ;

    start() {
        EventSystem.addListent("roleRefreshAll" , this.onRefresh , this)
        EventSystem.addListent("refreshItems" , this.onRefresh , this)
        this.onRefresh();
    }

    onRefresh(){
        if(this.isStamina){
            this.showLabel.string = PlayerModel.current_stamina + "/" + JSON.parse(ConfigManager.getItem("system" , 1)["val1"])[0]
        }
    }
}

