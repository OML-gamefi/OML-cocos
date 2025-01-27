import EventSystem from "db://assets/script/utils/EventSystem";
import UIUtils from "db://assets/script/utils/UIUtils";
import {ecs} from "db://oops-framework/libs/ecs/ECS";
import {Role} from "db://assets/script/game/role/Role";
import {smc} from "db://assets/script/game/common/SingletonModuleComp";


class MapManager{
    public charactor = {};
    public init(){
        EventSystem.addListent("S2CEnterMap" , this.S2CEnterMap , this)
        EventSystem.addListent("C2SMovePlayer" , this.C2SMovePlayer , this)
    }

    private C2SMovePlayer(data){
        // cc.log(data)
        // cc.log("玩家移动")
        let accountId = data["AccountId"]
        for(let a in this.charactor){
            if(this.charactor[a]["account_id"] == accountId){
                EventSystem.send("runRoleEvent" , {
                    targetX : data["TargetX"],
                    targetY : data["TargetY"],
                    player : this.charactor[a]["entity"].getCharactorComp(),
                })
            }
        }


        if(!this.charactor[accountId]){
            let ch = {}
            ch.account_id = data.AccountId
            ch.current_x = data.CurrentX
            ch.current_y = data.CurrentY
            this.charactor[ch.account_id] = ch
            let role = ecs.getEntity<Role>(Role);
            role.load(UIUtils.getInst().aStarToVec3Pos(25 , 267), false);
            ch.entity = role

            EventSystem.send("runRoleEvent" , {
                targetX : data["TargetX"],
                targetY : data["TargetY"],
                player : role.getCharactorComp(),
            })
        }
    }

    private S2CEnterMap(data){
        let ch = {}
        ch.account_id = data.AccountId
        ch.current_x = data.Posx
        ch.current_y = data.Posy
        this.charactor[ch.account_id] = ch
        let isWaitMap = false
        if(data.AccountId == LoginModel.account_id){
            EventSystem.send("PlayerEnterMap")
            isWaitMap = true;
        }
        if(!isWaitMap){
            let role = ecs.getEntity<Role>(Role);
            role.load(UIUtils.getInst().aStarToVec3Pos(data.Posx , data.Posy), false);
            ch.entity = role

            //data.AccountId 新玩家进入地图，  我告诉data.AccountId，我的位置信息
            // WebSocketManager.SendData(JSON.stringify({
            //     C2SSendToPlayerEnter :{
            //         AccountId : LoginModel.account_id,
            //         Posx : smc.own.getCharactorComp().pos.x,
            //         Posy : smc.own.getCharactorComp().pos.y,
            //         ToAccountId : data.AccountId
            //     }
            // }));
        }
    }
}

let mapManager = new MapManager();
mapManager.init();
window["GameMapManager"] = mapManager;