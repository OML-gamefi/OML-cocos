import EventSystem from "db://assets/script/utils/EventSystem";
import {Config} from "db://oops-framework/module/config/Config";

class PlayerModel{
    public roleName = ""
    public roleLv = 0
    public roleExp = 0
    public roleId = 0
    public roleRace = ""
    public current_hp = 0
    public current_mp = 0

    private raceEnum = {
        "HUMAN" : 1,
        "MONSTER" : 2,
        "GHOST" : 3,
        "IMMORTAL" : 4
    }

    //种族升级增加的属性，在system中的id
    private racePropEnum = {
        1 : 2,
        2 : 3,
        3 : 4,
        4 : 5
    }

    private propertySysEnum = {
        "hp" : 0,
        "mp" : 1,
        "atk" : 2,
        "mag_atk" : 3,
        "def" : 4,
        "mag_def" : 5,
    }

    public init(){
        let self = this
        EventSystem.addListent("S2CAccount" , function (a){
            console.log(a);
            self.refreshRoleData(a);
        } , this)
    }

    public refreshRoleData(a){
        this.roleName = a["Name"]
        this.roleExp = a["Exp"]
        this.roleLv = 0
        this.roleId = a["Id"]
        this.roleRace = a["Race"]

        this.current_hp = a["Current_hp"]
        this.current_mp = a["Current_mp"]

        let expCfgAll = ConfigManager.jsonMaps["upLv"]
        for(let e in expCfgAll){
            if(this.roleExp >= expCfgAll[e]["need_exp"]){
                this.roleLv = expCfgAll[e]["id"]
            }
        }
    }

    public getRropertyVal(type , race = 0 , lv = -1){
        if(race <= 0){
            race = this.getRaceId()
        }
        if(lv < 0){
            lv = this.roleLv
        }
        let sys = JSON.parse(ConfigManager.getItem("system" , this.racePropEnum[race])["val1"])
        let raceCfg = ConfigManager.getItem("race" , race);
        let base = raceCfg[type]
        let add = sys[this.propertySysEnum[type]] * lv
        return base+add;
    }

    public getRaceId(raceEnum = ""){
        if(raceEnum == ""){
            raceEnum = this.roleRace
        }
        return this.raceEnum[raceEnum]
    }
    //```json
    // {
    //     "code": 200,
    //     "message": "SUCCESS",
    //     "data": [
    //         {
    //             "id": 1,
    //             "name": "角色1",
    //             "race": 1,
    //             "level": 10,
    //             "exp": 1000,
    //             "max_exp": 2000,
    //             "sect_name": "青云门",
    //             "current_location": "青云山",
    //             "max_hp": 1000,
    //             "current_hp": 1000,
    //             "max_mp": 500,
    //             "current_mp": 500,
    //             "physical_attack": 100,
    //             "magic_attack": 80,
    //             "physical_defense": 50,
    //             "magic_defense": 40,
    //             "speed": 10,
    //             "critical_rate": 0.05,
    //             "critical_damage": 1.5,
    //             "hit_rate": 0.95,
    //             "dodge_rate": 0.05,
    //             "morality": 0,
    //             "max_stamina": 100,
    //             "current_stamina": 100,
    //             "copper_coins": 1000,
    //             "created_at": "2024-01-01T00:00:00",
    //             "last_login": "2024-01-02T00:00:00",
    //             "last_logout": "2024-01-02T01:00:00"
    //         }
    //     ]
    // }
    public loginPlayer(val){
        UIUtils.getInst().CloseViewByUrl("login/LoginView");
        let data = val["data"]
        if(data.length > 0){
            WebSocketManager.linkSocket()
        }else{
            UIUtils.getInst().OpenViewByUrl("chooseRole/chooseRole")
        }
    }

    public sendLogin(){
        WebSocketManager.SendData(JSON.stringify({
            C2SLoginMsg :{
                Token : LoginModel.token,
                AccountId : LoginModel.account_id,
                DeviceId : PlantformManager.getDeviceId(),
                DeviceName : cc.sys.platform
            }
        }));
    }
}

let playerModel = new PlayerModel();
playerModel.init()
window["PlayerModel"] = playerModel;