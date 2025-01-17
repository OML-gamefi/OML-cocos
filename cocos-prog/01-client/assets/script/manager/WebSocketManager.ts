class WebSocketManager{
    public ws = null;
    public connectHandler = null;
    public heartbeatHandler = null;
    public heartbeatTimeoutHandler = null;
    public heartbeatTimeSeconds = 5000;
    public heartbeatTimeoutSeconds = 30000;
    public heartbeatTimeoutWhenEnterForeground = null;
    public connectTimeoutListener = null;

    public heartTime = 0//心跳包发送过的次数

    //断线后重连后，需要保存的数据
    public closeWaitStrs = [];

    public sendTime = 0;

    public clearAll (){
        this.stopConnectTimeout();
        this.stopHeartbeat();
        if(this.ws != null)
        {
            this.ws.close();
            this.ws = null;
        }
    }

    //连接
    public linkSocket (isReconnection = false)
    {
        if(this.ws != null)
        {
            // this.ws.close();
            // this.ws = null;
            return false;
        }
        let wsUrl = "ws://127.0.0.1:3653"
        console.log(wsUrl)
        this.ws = new WebSocket(wsUrl);

        var self = this;
        this.ws.onopen = function (event) {
            //连接成功重新登陆角色
            self.stopConnectTimeout();
            if(self.heartbeatTimeSeconds > 0 && self.heartbeatTimeoutSeconds > 0)
            {
                self.startHeartbeat(self.heartbeatTimeSeconds);
            }
            if(isReconnection){
                // PlayerModel.sendReconnection();
            }else{
                PlayerModel.sendLogin();
            }
        };

        this.ws.onmessage = function (event) {
            try{
                // let eventJson = JSON.parse(event.data);
                //
                // EventSystem.send("HideJuhua" , "SEND_WEBSOCKET_DATA")
                // EventSystem.send(eventJson["cmd"] , eventJson);
                // if(eventJson["code"] == 0 && eventJson["cmd"] != "player.pushRecovery"){
                //     if(self.heartbeatTimeoutWhenEnterForeground != null)
                //     {
                //         clearTimeout(self.heartbeatTimeoutWhenEnterForeground);
                //         self.heartbeatTimeoutWhenEnterForeground = null;
                //     }
                //     self.startHeartbeat(self.heartbeatTimeSeconds);
                // }
                //
                // if(eventJson["cmd"] != "player.hearbeat")
                // {
                //     console.log('onmessage------------');
                //     console.log(JSON.stringify(eventJson));
                // }
                // self.closeWaitStrs = [];
            }
            catch
            {
                EventSystem.send("HideJuhua" , "SEND_WEBSOCKET_DATA")
            }
        };

        //连接失败
        this.ws.onerror = function (event) {
            this.ws = null;

            EventSystem.send("linkSocketError")
            EventSystem.send('HideJuhua' , "waitWSLogin")
            // WebSocketManager.linkSocket();
        };

        //链接关闭
        this.ws.onclose = function (event) {
            this.ws = null;

            EventSystem.send("linkSocketClose")
            EventSystem.send('HideJuhua' , "waitWSLogin")
            //服务器关闭连接并且不是被踢下线的，说明服务器异常关闭，尝试重新连接
            self.onHeartbeatTimeout();
        };
        this.startConnectTimeout();
        return  true;
    }

    public reconnect (){
        if(this.ws != null){
            return
        }
        if(this.heartbeatTimeoutWhenEnterForeground != null)
        {
            clearTimeout(this.heartbeatTimeoutWhenEnterForeground);
            this.heartbeatTimeoutWhenEnterForeground = null;
        }
        this.stopHeartbeat();

        let self = this;
        this.heartbeatTimeoutWhenEnterForeground = setTimeout(function()
        {
            self.disconnect();
            self.notifyDisconnectEvent();
        }, 500);
    }

    //发送数据
    public SendData (data)
    {
        if(this.ws != null && this.ws.readyState == 1)
        {
            this.ws.send(data);

        }
        return true;
    }

    public notifyDisconnectEvent (){
        this.linkSocket(true);
        if (this.disconnectListener != null && PlayerModel.reconnectState) {
            this.disconnectListener.func.call(this.disconnectListener.target);
        }
    }

    public setDisconnectListener(func, target){
        this.disconnectListener = { func: func, target: target };
    }

    public setConnectTimeoutListener (func, target){
        this.connectTimeoutListener = { func: func, target: target };
    }

    public onConnectTimeout (){
        if (this.connectTimeoutListener != null) {
            this.connectTimeoutListener.func.call(this.connectTimeoutListener.target);
        }
    }

    public stopConnectTimeout (){
        if(this.connectHandler != null)
        {
            clearInterval((this.connectHandler));
            this.connectHandler = null;
        }
    }

    public startConnectTimeout (){
        this.stopConnectTimeout();
        let self = this;
        this.connectHandler = setTimeout(function (){
            self.ws = null;
            self.onConnectTimeout();
        },15000);
    }

    public disconnect (){
        //告知服务器，我主动断开 TODO
        this.stopHeartbeat();
        if(this.ws != null)
        {
            // this.ws.close();
            this.ws.onmessage = (ev)=>{};
            this.ws = null;
        }
    }

    public onHeartbeatTimeout (){
        this.disconnect();
        if (this.disconnectListener != null && PlayerModel.reconnectState) {
            this.disconnectListener.func.call(this.disconnectListener.target);
        }
    }

    public stopHeartbeat (){
        if(this.heartbeatHandler != null)
        {
            clearTimeout(this.heartbeatHandler);
            this.heartbeatHandler = null;
        }
        if(this.heartbeatTimeoutHandler != null)
        {
            clearTimeout(this.heartbeatTimeoutHandler);
            this.heartbeatTimeoutHandler = null;
        }
    }

    public startHeartbeat (delay){
        this.stopHeartbeat();
        let self = this;
        this.heartbeatHandler = setTimeout(function()
        {
            if(this.ws != null)
            {
                // self.SendData(JSON.stringify({"cmd" : AppConst.GameSocketCmd.Hearts}) , false);

            }
        }, delay);
        this.heartbeatTimeoutHandler = setTimeout(function()
        {
            let v = delay + self.heartbeatTimeSeconds;
            self.onHeartbeatTimeout();
        }, delay + this.heartbeatTimeoutSeconds);
    }
}

let wb = new WebSocketManager()
window["WebSocketManager"] = wb;