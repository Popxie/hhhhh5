new Vue({
    el: '#app',
    data: {
        initShow: false,
        isShowDefaut: false,
        api: {
            url: 'http://test-api.mobilemart.cn/driver-web/tag', // 测试
            // url: 'https://api.mobilemart.cn/driver-web/tag', // 线上
            // url: 'https://mgoapi.18jian.cn/driver-web/tag', // 线上
        },
        path: {
            tag: '',
        },
    },
    created() {
        // document.cookie = 'driver_id=14930'  // 14930 自己    3621
        const driverId = this.getCookie('driver_id')
        if (driverId) {
            this.getTag(driverId);
        } else {
            window.location.href = 'http://test.xiaojubianli.com/index.php/Wechat/Drivers/login'
            // window.location.href = 'https://mgo.18jian.cn/index.php/Wechat/Drivers/login'
        }
    },

    methods: {
        alertFn(msg) {
            this.$toast({
                message: msg,
                position: 'middle',
                duration: 2000
            })
        },
        getCookie(key) {
            let arr
            const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`) // 正则匹配
            if ((arr = document.cookie.match(reg))) {
                return unescape(arr[2])
            }
            return null
        },
        getTag(driverId) {
            let self = this;
            self.$http.get(`${this.api.url}/${driverId}`)
                .then((res) => {
                    const result = res.data
                    const item = result.data.data
                    this.initShow = true
                    if (result.error_code === 0 && item && item.workType === 11) {
                        this.isShowDefaut = false
                        return
                    }
                    this.isShowDefaut = true
                }, (err) => {
                    self.alertFn('网络异常请稍后再试');
                    this.initShow = true
                    this.isShowDefaut = true
                })
        },
    }
})
