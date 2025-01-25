import { _decorator, Component, Node , Label} from 'cc';
const { ccclass, property } = _decorator;
import {choosePosRender} from "./choosePosRender"

@ccclass('choosePos')
export class choosePos extends Component {

    @property([choosePosRender])
    public renders : choosePosRender[] = [];
    start() {

    }

    refreshNode(race){
        let raceCfg = ConfigManager.getItem("race" , race)
        let map_id_1 = raceCfg.map_id_1
        for(let r = 0 ; r < this.renders.length ; r++){
            if(map_id_1[r]){
                this.renders[r].refreshNode(map_id_1[r]);
            }else{
                this.renders[r].node.active = false
            }
        }
    }
}

