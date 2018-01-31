new Vue({
    el: '#app',
    data: {
        sendBtnText: '发送验证码',
        showCanClick: true,
        showLoading: true,
        message: '',
        wxCode: '',
        openid: '',
        dataList: [],
    },

    created: function () {
        // 首先判断地址栏里面是否有参数
        if (window.location.href.indexOf('?') !== -1) {
            // 判断网址里面没有没有参数，有的话就进来，分离出 code
            this.wxCode = window.location.href.split('?')[1].split('&')[0].split('=')[1];
            // 请求波哥的接口获取 openid 需要传 wxCode
            this.getWxOpenId(this.wxCode);
        } else {
            // 从登陆页面跳转过来的 才会走这个方法
            this.getOrderList();
        }
    },
    methods: {
        // 将参数格式化
        transferFn: function (data) {
            let result = '';
            for (let i in data) {
                result += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return result;
        },
        // 获取openid
        getWxOpenId(data) {
            axios({
                method: 'post',
                url: 'https://mgo2.18jian.cn/index.php/Api/Auth/get_openid',
                data: this.transferFn({ code: data }),
            })
                .then((res) => {
                    if (res.data.status === 1) {
                        this.openid = res.data.result.openid;
                        var date = new Date();
                        date.setYear(2019);
                        // document.cookie = 'u_openid='+this.openid+';domain=.18jian.cn;expires='+date.toUTCString()+';path=/';
                        document.cookie = 'u_openid=' + this.openid + ';domain=.18jian.cn;path=/';
                        localStorage.setItem('u_openid', res.data.result.openid);
                        console.log('openid=>:', this.openid);
                        this.getOrderList()
                    } else {
                        // this.alertFn('getWxOpenId' + res.data.message);
                    }
                })
                .catch((err) => {
                    console.debug('err', err);
                })
        },
        // 获取订单列表
        getOrderList() {
            axios({
                method: 'get',
                url: 'https://mgoapi.18jian.cn/api-passenger/api/passenger/passengerOrderList',
                withCredentials: true,
            })
                .then((res) => {
                    if (res.data.res === 1) {
                        this.dataList = res.data.list
                        this.showLoading = false;
                    } else if (res.data.res === 3) {
                        this.showLoading = false;
                        this.message = '暂无订单记录';
                    } else {
                        location.href = 'https://mp.18jian.cn/passenger/login.html';
                        // 微信授权
                        // location.href = 'https://mgo2.18jian.cn/get-weixin-code.html?appid=wx5305351c290c2c33&scope=snsapi_base&state=https://mgoapi.18jian.cn/api-mp/api/passenger/passengerOrderList&redirect_uri=https://mp.18jian.cn/passenger/login.html';
                    }
                })
                .catch((err) => {
                    this.showLoading = false;
                    console.log('err', err);
                })
        }
    }
});
