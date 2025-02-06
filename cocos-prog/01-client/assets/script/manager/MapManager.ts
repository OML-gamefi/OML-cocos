import EventSystem from "db://assets/script/utils/EventSystem";
import UIUtils from "db://assets/script/utils/UIUtils";
import {ecs} from "db://oops-framework/libs/ecs/ECS";
import {Role} from "db://assets/script/game/role/Role";
import {smc} from "db://assets/script/game/common/SingletonModuleComp";
import {RoleViewComp} from "db://assets/script/game/role/view/RoleViewComp";


class MapManager{
    public charactor = {};
    public init(){
        EventSystem.addListent("S2CEnterMap" , this.S2CEnterMap , this)
        EventSystem.addListent("C2SMovePlayer" , this.C2SMovePlayer , this)
        EventSystem.addListent("S2CEnterLeave" , this.S2CEnterLeave , this)
    }

    private S2CEnterLeave(data){
        let accountId = data["AccountId"]
        if(this.charactor[accountId]){
            this.charactor[accountId].entity.destroy();
            delete this.charactor[accountId]
        }
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
            role.load(UIUtils.getInst().aStarToVec3Pos(data["CurrentX"] , data["CurrentY"]), false);
            ch.entity = role

            role.getCharactorComp().account_id = data.AccountId

            EventSystem.send("runRoleEvent" , {
                targetX : data["TargetX"],
                targetY : data["TargetY"],
                player : role.getCharactorComp(),
            })
        }
    }

    private S2CEnterMap(data){
        if(!this.charactor[data.AccountId]){
            let ch = {}
            ch.account_id = data.AccountId
            ch.current_x = data.Posx
            ch.current_y = data.Posy
            ch.map_id = data.NationId
            ch.name = data.Name
            this.charactor[ch.account_id] = ch
            let isWaitMap = false
            if(data.AccountId == LoginModel.account_id){
                EventSystem.send("PlayerEnterMap")
                isWaitMap = true;

                UIUtils.getInst().OpenViewByUrl("main/mainTop")
            }
            if(!isWaitMap){
                let role = ecs.getEntity<Role>(Role);
                role.load(UIUtils.getInst().aStarToVec3Pos(data.Posx , data.Posy), false);
                ch.entity = role
                role.getCharactorComp().account_id = data.AccountId
                role.getCharactorComp().role_name = data.Name
            }
        }else{
            this.charactor[data.AccountId].map_id = data.NationId
        }
    }
}

let mapManager = new MapManager();
mapManager.init();
window["GameMapManager"] = mapManager;