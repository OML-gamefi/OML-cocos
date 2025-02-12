class TimeManager{
    public timeServer = 0;
    // public timeDate;
    public showClientTime = 0;
    public init(){
        EventSystem.addListent('S2CHeart' , (a)=>{
            this.setServerTime(a);
        } , this);
    }

    private setServerTime(a){
        this.timeServer = a["Timestamp"] //服务器时间戳
        this.showClientTime = Date.parse(a['Time'])/1000;
    }

    public format = function (timeDate, e) {
        var i = e || "yyyy-MM-dd HH:mm:ss";
        return (i = (i = (i = (i = (i = (i = i.replace(
            "yyyy",
            timeDate.getFullYear() + ""
        )).replace("MM", this.fix2(timeDate.getMonth() + 1))).replace(
            "dd",
            this.fix2(timeDate.getDate())
        )).replace("HH", this.fix2(timeDate.getHours()))).replace(
            "mm",
            this.fix2(timeDate.getMinutes())
        )).replace("ss", this.fix2(timeDate.getSeconds())));
    };

    public countDown2 = function (t, e, o, a, func){
        if (null != e && 0 != t) {
            e.unscheduleAllCallbacks();
            e.schedule(s, 1);
            s();
        }
        function s() {
            var st = t - TimeUtils.TimeUtils.timeServer;
            if(st == null){
                e.string = ""
            }else if (st > 0) {
                func && func();
                e.string = TimeUtils.TimeUtils.second2hms(st)
            }
            else if (st <= 0) {
                o && o();
                e.unscheduleAllCallbacks();
            }
        }
    }

    public second2hms = function (t, e) {
        if (t > 86400 && null == e) {
            var o = t % 86400;
            o = Math.floor(o / 3600);
            let dayStr = LanguageManager.getTextByLanguageConfig(261)
            let hourStr = LanguageManager.getTextByLanguageConfig(262)
            if(LanguageManager.language == "en"){
                return (
                    Utils.StrFormat(dayStr , [Math.floor(t / 86400)])
                );
            }
            return (
                Utils.StrFormat(dayStr , [Math.floor(t / 86400)]) +" "+ (o > 0 ? Utils.StrFormat(hourStr , [o]) : "")
            );
        }
        var i = Math.floor(t / 3600),
            n = Math.floor((t - 3600 * i) / 60),
            l = t % 60,
            r = e || "HH:mm:ss";
        "HH:mm" == r && t < 60 && (r = "ss");
        return (
            (r = (r = (r = r.replace("HH", this.fix2(i))).replace(
                "mm",
                this.fix2(n)
            )).replace("ss", this.fix2(l))) + ("ss" == r ? "s" : "")
        );
    };

    public second3hms = function (t){
        var i = Math.floor(t / 3600),
            n = Math.floor((t - 3600 * i) / 60),
            l = t % 60,
            r = "HH:mm:ss";
        "HH:mm" == r && t < 60 && (r = "ss");
        return (
            (r = (r = (r = r.replace("HH", this.fix2(i))).replace(
                "mm",
                this.fix2(n)
            )).replace("ss", this.fix2(l))) + ("ss" == r ? "s" : "")
        );
    }

    public fix2 = function (t) {
        return t < 10 ? "0" + t : "" + t;
    };

    //根据时间戳获得周几
    public getWeek = function (timestamp){
        var date1 = new Date(timestamp);
        if(date1.getDay() == 0){ //周日
            return 6;
        }else{
            return date1.getDay() - 1; //0-5 对应 周1-周6
        }
        // return date1.getDay();
    };
}

let tm = new TimeManager()
tm.init();
window["TimeManager"] = tm;