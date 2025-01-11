class EventSystem{
    private static isDebug = false;
    private static e = {};
    private static allObject = {};
    private static i = 0;
    private static n = true;

    public static send(o, i , parm2){
        var l = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (EventSystem.n) {
            var r = null,
                a = 0,
                s = null;
            for (var c in EventSystem.e) {
                var _ = EventSystem.e[c],
                    d = _[o];
                if (null != d){
                    if (l) {
                        var u = parseInt(c.replace("__", ""));
                        if (u > a) {
                            a = u;
                            s = _.__target;
                            r = d;
                        }
                    } else d.apply(_.__target, null != i ? [i] : null);
                }
            }
            let param = null;
            if(i != null || parm2 != null){
                if(i != null){
                    param = [];
                    param.push(i)
                    if(parm2 != null){
                        param.push(parm2)
                    }
                }
                // param = [i != null ? i : null, parm2 != null ? parm2 : null];
            }
            l && null != r && r.apply(s, param);
        }
    }

    public static addListent(eventKey, eventCallBack, target){
        let targetName = target.__name;
        if (null == targetName) {
            target.__name = targetName = "__" + EventSystem.i++;
            //var s = this;
            let oldFun = target["onDestroy"];
            target.onDestroy = function() {
                oldFun && oldFun.apply(target);
                EventSystem.remove(target);
            }
        }
        if (null == EventSystem.e[targetName]) {
            EventSystem.e[targetName] = {
                __target: target
            };
        }
        EventSystem.e[targetName][eventKey] = eventCallBack;        
    }

    public static remove(t){
        var o = t.__name;
        EventSystem.e[o] = null;
        delete EventSystem.e[o];
    }

    public static removeAll(){
        EventSystem.e = {};
    }
}