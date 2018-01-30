new Vue({
    el: '#app',
    data: {
        isDisabled: false,
        showCoupon: false,
        isAbled: false,
        dataObj: {
            mobile: '',
            shortMsg: '',
            appid: '1002',
        },
        type: 1,
        sendBtnText: '发送验证码',
        jsApiList: [
            'onMenuShareAppMessage',
        ],
    },
    created() {
        this.getWeixinJsapiTicket();
    },
    methods: {
        alertFn(msg) {
            this.$toast({
                message: msg,
                position: 'middle',
                duration: 2000
            })
        },
        transferFn(data) {
            // 将参数格式化
            let result = '';
            for (let i in data) {
                result += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return result
        },
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
                var desc = "上车扫码吃零食喽~😊";
                // 朋友
                wx.onMenuShareAppMessage({
                    title: "车载零食券大礼包", // 分享标题
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
        // 计时器
        timeCountDown() {
            var self = this;
            self.isDisabled = true;
            var time = 60;
            self.sendBtnText = time + '秒后再试';
            var set = setInterval(function () {
                time--;
                self.sendBtnText = time + '秒后再试';
                if (time === 0) {
                    self.sendBtnText = '获取验证码';
                    clearInterval(set);
                    self.isDisabled = false;
                }

            }, 1000);
        },
        getMsgCode() {
            let self = this;
            let url = 'https://mgoapi.18jian.cn/api-account-web/mobile/' + self.dataObj.mobile + '?type=' + self.type;
            // let url = 'http://test-api.xiaojubianli.com:8080/api-account-web/mobile/' + self.dataObj.mobile + '?type=' + self.type;
            self.$http.get(url)
                .then((res) => {
                    if (res.data.error_code === 0) {

                    } else {
                        self.alertFn(res.data.err_msg);
                    }
                }, (err) => {
                    self.alertFn('网络异常请稍后再试');
                })
        },

        getCoupon(val) {
            let self = this;
            let url = 'https://mgoapi.18jian.cn/api-marketing-web/coupon/draw_coupon';
            // let url = 'http://test-api.xiaojubianli.com:8080/api-marketing-web/coupon/draw_coupon';

            self.$http.post(url, self.transferFn(val), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then((res) => {
                    if (res.data.error_code === 0 && res.data.data.biz_code === 0) {
                        self.showCoupon =  true;
                    } else if(res.data.error_code === 0 && res.data.data.biz_code !== 0) {
                        self.alertFn(res.data.data.biz_msg);
                    }
                    this.isAbled = false;
                }, (err) => {
                    self.alertFn('网络异常请稍后再试');
                    this.isAbled = false;
                })
        },
        // 获取短信验证码    15258685352
        sendCode() {
            let self = this;
            let reg = /^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
            let result = reg.test(self.dataObj.mobile);
            if (!result) {
                this.alertFn('手机号格式错误！')
                return;
            }
            this.getMsgCode(self.dataObj.mobile);
            this.timeCountDown();
        },
        closeClick() {
            this.showCoupon = false;
        },
        confirmClick() {
            if(!this.dataObj.mobile) {
                this.alertFn('请填写手机号！');
                return;
            }
            if(!this.dataObj.shortMsg) {
                this.alertFn('请填写验证码');
                return;
            }
            this.isAbled = true;
            this.getCoupon(this.dataObj);
        }
    }
})
