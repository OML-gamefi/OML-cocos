import { _decorator, Component, Node , Label , ProgressBar} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('roleView')
export class roleView extends Component {
    @property(Label)
    public roleName: Label

    @property(Label)
    public roleLv: Label

    @property(Label)
    public roleId: Label

    @property(Label)
    public roleRace: Label

    @property(ProgressBar)
    public hp: ProgressBar

    @property(ProgressBar)
    public mp: ProgressBar

    start() {
        this.refrehView();
    }

    refrehView(){
        this.roleName.string = PlayerModel.roleName
        this.roleLv.string = "Lv." + PlayerModel.roleLv
        this.roleId.string = PlayerModel.roleId

        let raceCfg = ConfigManager.getItem("race" , PlayerModel.getRaceId());
        this.roleRace.string = raceCfg[LanguageManager.language]
    }
}

