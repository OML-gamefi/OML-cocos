import HttpManager from "db://assets/script/manager/HttpManager";

class ConfigManager{
    public configs = [
        "language", "enemy", "event", "item", "map",
        "nation", "race", "system", "upLv",
    ];

    public loadSuccessNum = 0;

    public jsonMaps = [];

    public informationEnemy = {}

    public getItem(name , id){
        if(this.jsonMaps[name] && this.jsonMaps[name][id]){
            return this.jsonMaps[name][id]
        }
        return null
    }

    public loadAll(){
        var _t = this;
        for(var i=0;i<this.configs.length;i++)
        {
            cc.resources.load('config/game/' + this.configs[i] , function(err , json){
                if(json != null)
                {
                    _t.jsonMaps[json.name] = json.json;
                    _t.loadSuccessNum++;

                    if(_t.isLoadOver()){
                        EventSystem.send("loadCfgAllEnd")
                    }
                }
                else
                {
                    cc.log(err);
                    _t.loadSuccessNum++;
                }
            });
        }
    }

    private isLoadOver(){
        return this.loadSuccessNum == this.configs.length
    }
}

let manager = new ConfigManager()
window["ConfigManager"] = manager;