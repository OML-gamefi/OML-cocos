import { _decorator, Component, Node , ProgressBar , Label} from 'cc';
import {TextureLoad} from "db://assets/script/utils/TextureLoad";
import {TouchProgressBar} from "db://assets/script/utils/TouchProgressBar";
const { ccclass, property } = _decorator;

@ccclass('settingView')
export class settingView extends Component {
    @property({type : TextureLoad})
    private musicLoad

    @property({type : TextureLoad})
    private musicEftLoad

    @property({type : TouchProgressBar})
    private musicVol

    @property({type : TouchProgressBar})
    private musicEftVol


    @property({type : Node})
    private languageNode : Node

    @property({type : Label})
    private languageLabel : Label

    start() {
        this.languageNode.active = false
        this.refreshView();
    }

    refreshView(){
        let musicData = SaveManager.getData(SaveManager.musicKey)
        let musicEftData = SaveManager.getData(SaveManager.musicEftKey)
        if(LanguageManager.language == "cn"){
            this.musicLoad.Url = musicData == 1 ? "res/texture/setting/open_cn" : "res/texture/setting/close_cn"
            this.musicEftLoad.Url = musicEftData == 1 ? "res/texture/setting/open_cn" : "res/texture/setting/close_cn"
        }else{
            this.musicLoad.Url = musicData == 1 ? "res/texture/setting/open_en" : "res/texture/setting/close_en"
            this.musicEftLoad.Url = musicEftData == 1 ? "res/texture/setting/open_en" : "res/texture/setting/close_en"
        }

        let musicVolKey = SaveManager.getData(SaveManager.musicVolKey , "float")
        this.musicVol.setCurrentValue(musicVolKey);
        let musicEftVolKey = SaveManager.getData(SaveManager.musicEftVolKey , "float")
        this.musicEftVol.setCurrentValue(musicEftVolKey)

        this.languageLabel.string = LanguageManager.language == "cn" ? "中文" : "English"
    }

    onChangeEn(){
        LanguageManager.qiehuan("en")
        this.languageNode.active = false
        this.refreshView();
    }

    onChangeCn(){
        LanguageManager.qiehuan("cn")
        this.languageNode.active = false
        this.refreshView();
    }

    onClickMusic(){
        let musicData = SaveManager.getData(SaveManager.musicKey)
        if(musicData == 1){
            SaveManager.saveData(SaveManager.musicKey , 0);
        }else{
            SaveManager.saveData(SaveManager.musicKey , 1);
        }
        this.refreshView();
    }

    onClickMusicEft(){
        let musicData = SaveManager.getData(SaveManager.musicEftKey)
        if(musicData == 1){
            SaveManager.saveData(SaveManager.musicEftKey , 0);
        }else{
            SaveManager.saveData(SaveManager.musicEftKey , 1);
        }
        this.refreshView();
    }

    onClickMusicVol(val){
        SaveManager.saveData(SaveManager.musicVolKey , val);
    }

    onClickMusicEftVol(val){
        SaveManager.saveData(SaveManager.musicEftVolKey , val);
    }

    openLanguage(){
        this.languageNode.active = true
    }

    closeLanguage(){
        this.languageNode.active = false
    }
}

