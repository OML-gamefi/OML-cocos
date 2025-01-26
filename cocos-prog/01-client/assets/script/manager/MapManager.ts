import EventSystem from "db://assets/script/utils/EventSystem";
import UIUtils from "db://assets/script/utils/UIUtils";

class MapManager{
    public charactor = {};
    public init(){
        EventSystem.addListent("S2CEnterMap" , this.S2CEnterMap , this)
        EventSystem.addListent("C2SMovePlayer" , this.C2SMovePlayer , this)
    }

    private C2SMovePlayer(data){
        cc.log(data)
        cc.log("玩家移动")
    }

    private S2CEnterMap(data){
        let ch = {}
        ch.account_id = data.AccountId
        ch.current_x = data.Posx
        ch.current_y = data.Posy
        this.charactor[ch.account_id] = ch
        if(data.AccountId == LoginModel.account_id){
            EventSystem.send("PlayerEnterMap")
        }
    }
}

let mapManager = new MapManager();
mapManager.init();
window["GameMapManager"] = mapManager;