class LanguageManager{
    public language = "cn"

    public qiehuan (lang){
        this.language = lang;
        cc.sys.localStorage.setItem("language" , lang);
        EventSystem.send("languageRep")
    }
}

let manager = new LanguageManager()
window["LanguageManager"] = manager;