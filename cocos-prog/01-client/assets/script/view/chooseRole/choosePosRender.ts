import { _decorator, Component, Node ,Label} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('choosePosRender')
export class choosePosRender extends Component {
    @property
    private posIndex = 0

    private nationId = 0;

    @property({ type: Label })
    private showLabel = null

    @property({ type: Node })
    private chooseRoleView = null
    start() {

    }

    refreshNode(nationId){
        let nationCfg = ConfigManager.getItem("nation" , nationId)
        this.showLabel.string = nationCfg[LanguageManager.language]

        this.nationId = nationId;
    }

    onClick(){
        let chooseRole = this.chooseRoleView.getComponent("chooseRole")
        chooseRole.onClickNation(this.nationId);
    }
}

