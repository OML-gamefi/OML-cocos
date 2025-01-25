import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chooseRole')
export class chooseRole extends Component {
    @property({ type: Node })
    private raceNode = null

    @property({ type: Node })
    private posNode = null

    private chooseRace = 0;
    private choosePos = 0;
    start() {
        this.refreshView();
    }

    refreshView() {
        this.raceNode.active = this.chooseRace == 0
        this.posNode.active = this.chooseRace > 0
    }

    onClickRace(a , b){
        this.chooseRace = b;
        this.refreshView();
    }
}

