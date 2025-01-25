import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JuhuaView')
export class JuhuaView extends Component {
    private showAry = [];
    start() {
        EventSystem.addListent("ShowJuhua" , this.OnShowJuhua , this);
        EventSystem.addListent("HideJuhua" , this.OnHideJuhua , this);
        EventSystem.addListent("ClearJuhua" , this.ClearAll , this);

        this.node.active = false;
    }

    OnShowJuhua(type){
        this.showAry.push(type);
        this.node.active = this.showAry.length > 0;
    }

    OnHideJuhua(type){
        if(this.showAry.indexOf(type) >= 0)
        {
            this.showAry.splice(this.showAry.indexOf(type) , 1);
        }
        this.node.active = this.showAry.length > 0;
    }

    ClearAll(){
        this.showAry = [];
        this.node.active = this.showAry.length > 0;
    }
}

