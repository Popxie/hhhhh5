new Vue({
    el: '#app',
    data: {
        sendBtnText: '发送验证码',
        showCanClick: true,
        wxCode: '',
        openid: '',
        query: {
            tel: '',
            code: '',
        },
    },
    created: function () {
        console.log('cookie==', document.cookie);
        console.log('localStorage', localStorage.getItem('u_openid'));
    },
    methods: {
        alertFn: function (msg) {
            this.$toast({
                message: msg,
                duration: 1000
            });
        },

        // 将参数格式化
        transferFn: function (data) {
            let result = '';
            for (let i in data) {
                result += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return result;
        },

        // 倒计时
        preventSend: function () {
            let self = this;
            let time = 60;
            self.sendBtnText = time + '秒后获取';
            let set = setInterval(function () {
                time--;
                self.sendBtnText = time + '秒后获取';
                if (time === 0) {
                    self.sendBtnText = '发送验证码';
                    self.showCanClick = true;
                    clearInterval(set);
                }

            }, 1000);
        },
        // 获取验证码
        sendCodeRequest: function () {
            if (!this.query.tel) {
                this.alertFn('请填写手机号');
                return
            }

            let reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!reg.test(this.query.tel)) {
                this.alertFn('手机号格式错误');
                return
            }
            this.showCanClick = false;
            // 倒计时
            this.preventSend();
            let url = 'https://mgoapi.18jian.cn/api-driver/api/user/smsGain';
            axios.post(url, this.transferFn(this.query))
                .then((res) => {
                    console.log('res验证码', res);
                    this.alertFn(res.data.msg);
                })
        },


        // 登陆
        loginClick: function () {
            var self = this;
            // axios.interceptors.request.use(function (config) {
            //     config.headers.token = self.openid;  //将接口返回的token信息配置到接口请求中 （未被采用）
            //     return config;
            // }, function (error) {
            //     return Promise.reject(error);
            // });

           if (!this.query.tel) {
               this.alertFn('请填写手机号');
               return
           }

           let reg = /^1[3|4|5|7|8][0-9]{9}$/;
           if (!reg.test(this.query.tel)) {
               this.alertFn('手机号格式错误');
               return
           }

           if (!this.query.code) {
               this.alertFn('请填写验证码');
               return
           }

           // 发起登陆请求
            axios({
                method: 'post',
                url: 'https://mgoapi.18jian.cn/api-passenger/api/passenger/passengerLogin',
                data: this.transferFn(this.query),
                withCredentials: true,
            })
                .then((res) => {
                    console.log('res登陆', res);
                    if(res.data.res === 1) {
                        // 登陆成功以后跳转到 订单列表页面
                        window.location.href='https://mp.18jian.cn/passenger/myOrder.html'
                    } else {
                        // 短信验证失败
                        this.alertFn(res.data.msg);
                    }

                })
                .catch((err) => {
                    this.alertFn('登陆异常，请稍后在做尝试');
                })
        },
    }
});
