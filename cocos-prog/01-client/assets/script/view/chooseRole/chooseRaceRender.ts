import { _decorator, Component, Node , Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chooseRaceRender')
export class chooseRaceRender extends Component {
    @property
    private race = 1;

    @property({ type: Label })
    private showLabel = null
    start() {
        let raceCfg = ConfigManager.getItem("race" , this.race)
        this.showLabel.string = raceCfg[LanguageManager.language]
    }

    update(deltaTime: number) {
        
    }
}

