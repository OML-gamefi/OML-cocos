import { _decorator, Component, Node , Sprite , resources , SpriteFrame , Texture2D} from 'cc';
const { ccclass, property } = _decorator;
@ccclass('TextureLoad')
export class TextureLoad extends Component {
    private _res = null;
    private _resFrame = null;
    private content = null;
    private loadHandle = null;
    private target = null;
    private isClearLoad = true;
    private isGray = false
    @property
    get Url(){
        return this._url;
    }

    set Url(t){
        if (this._url != t) {
            this._url = t + "/spriteFrame";
            this.onChangeUrl();
        }else{
            null != this.loadHandle && this.loadHandle.apply(this.target , this);
        }
    }

    @property
    private _url:string = "";

    ctor() {

    }

    start() {

    }

    onDestroy() {
        this.loadHandle = null;
        this.target = null;
        this.reset();
    }

    reset(){
        this._url = null;
        if (null != this.content) {
            this.content.removeFromParent(!0);
            this.content.destroy();
            this.content = null;
        }
        this.clearRes();
    }

    clearRes(){
        if (this._resframe) {
            this._res = null;
            this._resframe = null;
        }
        if(this.resRef != null && this.isClearLoad)
        {
            this.resRef.decRef();
            this.resRef = null;
        }
    }

    onChangeUrl(){
        var _this = this,
            newUrl = this._url;
        if (null != newUrl && 0 != newUrl.length) {
            resources.load(newUrl, SpriteFrame , function(o, object) {
                _this.isClearLoad = true;
                _this.onAddObject(o, object , newUrl);
            })
        }else {
            this.reset();
        }
    }

    onAddObject(o, object , newUrl){
        let _this = this;
        _this.reset();
        if (null == o && null != object)
        {
            _this.resRef = object;
            object.addRef();
            _this._res = _this._url = newUrl;
            _this._resframe = object;
            _this.node && (_this.node.getComponent(Sprite).spriteFrame = object);
            // if(cc.isValid(_this.node) && _this.nodeWidth != null && _this.nodeWidth > 0){
            //     _this.node.width = _this.nodeWidth;
            // }
            // if(cc.isValid(_this.node) && _this.nodeHeight != null && _this.nodeHeight > 0){
            //     _this.node.height = _this.nodeHeight;
            // }

            // UIUtils._UIUtils.changeSpritesShader(_this.node , _this.isGray);

            null != _this.loadHandle && _this.loadHandle.apply(_this.target);
        }
        else
        {
            cc.log("load ERROR=>" + newUrl);
            cc.log(o);
        }
    }
}

