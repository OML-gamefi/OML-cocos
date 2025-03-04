import { _decorator, Component, Node , Canvas , sys , log , resources , v3} from 'cc';
import AppConst from "../utils/AppConst";
import HttpManager from "db://assets/script/manager/HttpManager";
import MapRoadUtils from "db://assets/script/game/map/view/map/road/MapRoadUtils";

/**
 * UIUtils
 */
export default class UIUtils {
    private UIMap = {};
    private LoadUIMap = {};
    private static inst: UIUtils = null;

    public static getInst(){
        if(UIUtils.inst == null){
            UIUtils.inst = new UIUtils();
        }
        return UIUtils.inst;
    }

    public OpenViewByUrl(url , openParam = null , callBack = null, isCloseOld = false) {
        url = "res/prefab/views/" + url
        if(this.UIMap == null)
        {
            this.UIMap = {};
        }
        if(this.UIMap[url] != null && isCloseOld)
        {
            this.CloseViewByUrl(url);
        }
        log("打开UI:" + url)

        if(this.LoadUIMap == null)
        {
            this.LoadUIMap = {};
        }

        if(this.UIMap[url] != null)
        {
            if(callBack){
                callBack();
            }
            log("UI已打开" + url)
            return;
        }

        if(this.LoadUIMap[url] != null){
            log("界面正在加载队列:" + url)
            return;
        }       
        this.LoadUIMap[url] = true;
        let _this = this;        
        resources.load(url, function (r, gameObject) {
            console.log("加载界面UI：" + url)
            //增加引用计数
            gameObject.addRef();
            _this.LoadUIMap[url] = null;

            //实例化
            var newView = cc.instantiate(gameObject);
            newView.__url = url;
            newView._openParam = openParam;
            //添加view控制组件
            if(newView.getComponent("ViewCtrl") == null)
            {
                newView.addComponent("ViewCtrl");
            }
            let viewCtrl = newView.getComponent("ViewCtrl");
            log(viewCtrl.Hierarchy)
            if(AppConst.UIRoot.nodeObjs[viewCtrl.Hierarchy]){
                AppConst.UIRoot.nodeObjs[viewCtrl.Hierarchy].addChild(newView)
            }else{
                AppConst.UIRoot.nodeObjs["Cover"].addChild(newView)
            }
            
            _this.UIMap[url] = newView;
            if(callBack){
                callBack();
            }            
        });
    }

    public CloseView(view){
        if(view.node && view.node.__url && this.UIMap[view.node.__url]){
            delete this.UIMap[view.node.__url];
        }

        if (view.node) {
            view.node.destroy();
            view.node.removeFromParent(!0);
        }
    }

    public CloseViewByUrl(url){
        url = "res/prefab/views/" + url
        if(this.UIMap[url])
        {
            let view = this.UIMap[url];

            delete this.UIMap[url];
            if (view) {
                view.destroy();
                view.removeFromParent(!0);
            }
        }
    }

    public changeSpritesShader(node, flag){
        let materialStr = flag ? '2d-gray-sprite' :'2d-sprite';
        let material = cc.Material.getBuiltinMaterial(materialStr);

        if(cc.isValid(node))
        {
            let childrens =  node.getComponentsInChildren(cc.Sprite);
            for(let i =0;i < childrens.length; i++)
            {
                childrens[i].setMaterial(0, material);
            }
        }
    }

    public aStarToVec3Pos(x , y){
        x = parseInt(x);
        y = parseInt(y);
        let p = MapRoadUtils.instance.getPixelByDerect(x, y);
        return v3(p.x, p.y);
    }
}

window["UIUtils"] = UIUtils;