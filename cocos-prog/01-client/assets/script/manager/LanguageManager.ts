class LanguageManager{
    public language = "cn"

    //通过language id获取文字
    public getTextByLanguageConfig = function(id)
    {
        if(ConfigManager.getItem("language" , id))
        {
            return ConfigManager.getItem("language" , id)[this.language];
        }
        return id;
    }

    public qiehuan (lang){
        this.language = lang;
        cc.sys.localStorage.setItem("language" , lang);
        EventSystem.send("languageRep")
    }
}

let manager = new LanguageManager()
window["LanguageManager"] = manager;