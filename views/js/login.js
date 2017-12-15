new Vue({
    el: '#app',
    data: {
        sendBtnText: '发送验证码',
        showCanClick: true,
        query: {
            phone: '',
            couponCode: ''
        },
    },
    created: function() {

    },
    methods: {
        alertFn: function(msg) {
            this.$toast({
                message: msg,
                duration: 1000
            });
        },
        loginClick: function() {

            if(!this.query.phone) {
                this.alertFn('请填写手机号');
                return
            }

            let reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if(!reg.test(this.query.phone)) {
                this.alertFn('手机号格式错误');
                return
            }

            if(!this.query.couponCode) {
                this.alertFn('请填写验证码');
                return
            }
            this.isShowLogin = false;
        },

        sendCodeRequest: function () {
            let reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if(!reg.test(this.query.phone)) {
                this.alertFn('手机号格式错误');
                return
            }
            this.showCanClick = false;
            this.preventSend();
            // let url = 'https://sit.mingbikes.com/api/login';
            // axios.get(url, {params: val})
            //     .then((res) => {
            //         console.debug(res)
            //     })
        },

        //倒计时
        preventSend: function () {
            let self = this;
            let time = 3;
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
    }
});
