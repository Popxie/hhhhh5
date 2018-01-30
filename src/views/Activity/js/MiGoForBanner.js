new Vue({
    el: '#app',
    data: {
        jsApiList: [
            'onMenuShareAppMessage',
        ],
    },
    created() {
        this.getWeixinJsapiTicket();
    },
    methods: {
        // 获取微信tick，完成验签
        getWeixinJsapiTicket() {
            var self = this;
            var url = "https://mgoapi.18jian.cn/api-account-web/wechat/driver/ticket/jsapi";
            self.$http.get(url)
                .then((res) => {
                    if (res.data.err_msg === 'success') {
                        var signArgs = {
                            timestamp: (new Date()).getTime(),  // 时间戳
                            noncestr: Math.random().toString(36).substr(2), // 随机字符串
                            jsApiTicket: res.data.data.ticket,              // jsApiTicket
                        };

                        let url = location.href;
                        let preSha = 'jsapi_ticket=' + signArgs.jsApiTicket + '&noncestr=' + signArgs.noncestr + '&timestamp=' + signArgs.timestamp + '&url=' + url;
                        let signResult = {
                            noncestr: signArgs.noncestr,
                            timestamp: signArgs.timestamp,
                            signature: sha1(preSha)
                        }
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: "wxd4c744355b802aec",
                            timestamp: signResult.timestamp,
                            nonceStr: signResult.noncestr,
                            signature: signResult.signature,
                            jsApiList: self.jsApiList
                        });
                        self.wxReady();
                    }
                }).catch((err) => {
                    self.alertFn('系统异常，请稍后再试!')
                });
        },
        wxReady() {
            let self = this;
            wx.ready(() => {
                var imgUrl = "http://p1lw91kqi.bkt.clouddn.com/share_logo.png";
                var link = window.location.href;
                var desc = "Mobile Go魔急便联手咪咕阅读，10礼包等你拿，做个有“味”的人";
                // 朋友
                wx.onMenuShareAppMessage({
                    title: "Mobile Go魔急便用户专属福利", // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        self.$messagebox({
                            title: '提示',
                            message: '分享成功',
                            showCancelButton: false,
                            confirmButtonText: "确认"
                        });
                    }
                });

            })
        },
    }
})
