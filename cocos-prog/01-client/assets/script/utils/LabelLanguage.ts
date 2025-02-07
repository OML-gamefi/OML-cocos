import { _decorator, Component, Node , Label , RichText , CCInteger} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelLanguage')
export class LabelLanguage extends Component {
    private languageLabel : Label
    private languageRichText : RichText

    @property({ type: CCInteger })
    private languageId : 0
    start() {
        this.languageLabel = this.node.getComponent(Label)
        this.languageRichText = this.node.getComponent(RichText)
        this.setLabel();
    }

    setLabel(){
        if(this.languageId > 0){
            let languageCfg = ConfigManager.getItem("language" , this.languageId)
            if(languageCfg){
                if(this.languageLabel != null){
                    this.languageLabel.string = languageCfg[LanguageManager.language]
                }
                if(this.languageRichText != null){
                    this.languageRichText.string = languageCfg[LanguageManager.language]
                }
            }
        }
    }

    setLanguageId(id){
        this.languageId = id;
        this.setLabel();
    }
}

