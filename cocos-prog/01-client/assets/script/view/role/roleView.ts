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

    @property(Label)
    public hpLabel: Label

    @property(Label)
    public mpLabel: Label

    @property(Label)
    public atkLabel: Label

    @property(Label)
    public mpAtk: Label

    @property(Label)
    public atkPhy: Label

    @property(Label)
    public mpPhy: Label

    start() {
        this.refrehView();
    }

    refrehView(){
        this.roleName.string = PlayerModel.roleName
        this.roleLv.string = "Lv." + PlayerModel.roleLv
        this.roleId.string = PlayerModel.roleId

        let raceCfg = ConfigManager.getItem("race" , PlayerModel.getRaceId());
        this.roleRace.string = raceCfg[LanguageManager.language]

        this.atkLabel.string = PlayerModel.getRropertyVal("atk")
        this.mpAtk.string = PlayerModel.getRropertyVal("mag_atk")
        this.atkPhy.string = PlayerModel.getRropertyVal("def")
        this.mpPhy.string = PlayerModel.getRropertyVal("mag_def")

        let maxHp = PlayerModel.getRropertyVal("hp")
        this.hpLabel.string = PlayerModel.current_hp
        this.hp.progress = PlayerModel.current_hp / maxHp

        let maxMp = PlayerModel.getRropertyVal("mp")
        this.mpLabel.string = PlayerModel.current_mp
        this.mp.progress = PlayerModel.current_mp / maxMp
    }
}

