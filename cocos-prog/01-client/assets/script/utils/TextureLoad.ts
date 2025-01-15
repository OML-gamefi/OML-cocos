import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import UIUtils from "../utils/UIUtils";
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
            this._url = t;
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
            cc.resources.load(newUrl,function(o, object) {
                _this.isClearLoad = true;
                _this.onAddObject(o, object , newUrl);
            })
        }else {
            this.reset();
        }
    }

    onAddObject(o, object , newUrl){
        var _this = this;
        _this.runSuccess = true;

        _this.reset();
        if (null == o && null != object) {
            _this.resRef = object;
            object.addRef();
            _this.node && _this.node.childrenCount > 0 && _this.reset();
            _this._res = _this._url = newUrl;
            _this._resframe = object;
            var n = cc.instantiate(object);
            _this.content = n;
            _this.node && _this.node.addChild(n);

            UIUtils.getInst().changeSpritesShader(this.node , this.isGray);

            null != _this.loadHandle && _this.loadHandle.apply(_this.target);
        } else {
            cc.error("url error->" + newUrl);
        }
    }
}

