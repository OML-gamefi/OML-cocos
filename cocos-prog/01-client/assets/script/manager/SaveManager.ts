class SaveManager{
    public musicKey = "musicKey"
    public musicEftKey = "musicEftKey"

    public musicVolKey = "musicVolKey"
    public musicEftVolKey = "musicEftVolKey"

    public init() {
    }

    public gameStart(){
        let musicVal = this.getData(this.musicKey);
        if(musicVal == null){
            this.saveData(this.musicKey , 1)
            this.saveData(this.musicEftKey , 1)

            this.saveData(this.musicVolKey , 1)
            this.saveData(this.musicEftVolKey , 1)
        }
    }

    public saveData = function (key , val){
        cc.sys.localStorage.setItem(key, val);
    }

    public getData = function (key , type = "int"){
        let data = cc.sys.localStorage.getItem(key);
        if(data != null){
            if(type == "int"){
                return parseInt(data)
            }
            if(type == "float"){
                return parseFloat(data)
            }
            if(type == "json"){
                return JSON.parse(data)
            }
        }else {
            return null
        }
    }
}

let smanager = new SaveManager()
smanager.init()
window["SaveManager"] = smanager;