import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ListItem')
export class ListItem extends Component {
    start() {

    }

    _registerEvent() {
        // if (this.btnCom && this._list.selectedMode > 0 && !this.eventReg) {
        //     this.btnCom.clickEvents.unshift(this.createEvt(this, 'onClickThis'));
        //     this.eventReg = true;
        // }
    }

    update(deltaTime: number) {
        
    }
}

