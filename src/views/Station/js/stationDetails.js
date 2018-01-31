new Vue({
    el: "#app",
    data: {
        id: null,
        stationInfo: {
            name: '',
            stationTel: '',
            workTimeDesc: '',
            address: '',
            latitude: '',   // 纬度
            longitude: '',  // 经度
            imgUrl: '',
        },
        jsApiList: [
            'onMenuShareAppMessage',
            'openLocation',
        ]
    },
    created() {
        // var url = "http://test-api.xiaojubianli.com:8080/api-driver-web/station/stationInfo/" + sessionStorage.getItem("id");
        var url = "https://mgoapi.18jian.cn/api-driver-web/station/stationInfo/" + sessionStorage.getItem("id");
        this.$http.get(url)
            .then((res) => {
                this.stationInfo = Object.assign({}, this.stationInfo, res.data.data);
                res.data.data.type === 2 ? this.stationInfo.imgUrl = 'http://p1lw91kqi.bkt.clouddn.com/share_logo.png' : '';
                console.log(this.stationInfo);
            })
        this.getWeixinJsapiTicket();
    },
    methods: {
        transferFn(data) {
            // 将参数格式化
            let result = '';
            for (let i in data) {
                result += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return result
        },
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
                    console.log('err', err);
                });
        },
        wxReady() {
            let self = this;
            wx.ready(() => {
                var imgUrl = "http://p1lw91kqi.bkt.clouddn.com/share_logo.png";
                var link = window.location.href;
                var desc = "测试";
                // 朋友
                wx.onMenuShareAppMessage({
                    title: "测试标题", // 分享标题
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

        mapClick() {
            // 使用微信内置地图查看位置接口
            wx.openLocation({
                latitude: this.stationInfo.latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: this.stationInfo.longitude, // 经度，浮点数，范围为180 ~ -180。
                name: this.stationInfo.name, // 位置名
                address: this.stationInfo.address, // 地址详情说明
                scale: 8, // 地图缩放级别,整形值,范围从1~28。默认为最大
                // infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        }
    }
});
