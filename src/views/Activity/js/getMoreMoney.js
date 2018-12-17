new Vue({
    el: '#app',
    data: {
        popupVisible: true,
        api: {
            baseUrl: 'http://dev-api.mobilemart.cn', // 测试
            // baseUrl: 'https://api.mobilemart.cn', // 线上
        },
        path: {
            getAvatarAndNameUrl: '/driver-center-api/invite/driver',
            getRedPacket: '/driver-center-api/invite/redpacket',
        },
        driverInfo: {}, // 邀请人的昵称和头像
        isInit: false,
        isShowRules: false, // 活动规则
        hasGetRedPackage: false, // 是否已领取
        cityList: [{
                cityName: '上海',
                citySn: '310100',
                isChoosed: false,
                isSupported: true,
            },
            {
                cityName: '杭州',
                citySn: '330100',
                isChoosed: false,
                isSupported: false,
            },
            {
                cityName: '深圳',
                citySn: '440300',
                isChoosed: false,
                isSupported: false,
            },
            {
                cityName: '北京',
                citySn: '110100',
                isChoosed: false,
                isSupported: false,
            },
        ],
        formInfo: {
            tel: '',
            citySn: '',
            cityName: '',
        }, // 提交表单的所有信息
    },
    created() {
        this.getAvatarAndName()
    },
    methods: {
        alertFn(msg) {
            this.$toast({
                message: msg,
                position: 'middle',
                duration: 2000,
            })
        },
        /**
         * 单个城市名点击事件
         */
        cityClick(item, index) {
            this.popupVisible = false
            this.formInfo = item
            this.isShowRules = item.isSupported ? true : false
            this.cityList.forEach((e, i) => {
                if (index === i ) {
                    e.isChoosed = true
                    return
                }
                e.isChoosed = false
            })
        },
        /**
         * 选择城市
         */
        chooseCityClick() {
            this.popupVisible = !this.popupVisible
        },
        /**
         * 收下红包
         */
        getRedPackageClick() {
            if(!this.formInfo.tel) {
                this.alertFn('请填写手机号')
                return
            }
            this.getRedPackage()
        },
        /**
         * 立即查看
         */
        checkClick() {

        },
        /**
         *
         * @param {获取url中的openId} name
         */
        getOpenId(name, url) {
            const reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i')
            if (reg.test(url)) {
                return unescape(RegExp.$2.replace(/\+/g, ' '))
            }
            return ''
        },
        /**
         * 收红包
         */
        getRedPackage() {
            axios({
                method: 'post',
                url: this.api.baseUrl + this.path.getRedPacket,
                data: this.formInfo,
                headers: {
                    openId: this.getOpenId('openId', window.location.href)
                }
            }).then(res => {
                const error_code = res.data.error_code
                // error_code: 0 表示成功 其他都是失败
                if (error_code !== 0) {
                    this.alertFn(res.data.err_msg)
                    return
                }
                this.hasGetRedPackage = true
            }, e => {
                this.alertFn(e.message)
            })
        },
        /**
         * 获取邀请人头像和昵称
         */
        getAvatarAndName() {
            axios({
                method: 'get',
                url: this.api.baseUrl + this.path.getAvatarAndNameUrl,
                headers: {
                    openId: this.getOpenId('openId', window.location.href)
                }
            }).then(res => {
                this.driverInfo = res.data.data
                // 加密名字
                this.driverInfo.realname = this.driverInfo.realname.replace(/.(?=.)/g, '*')
            })
        }
    },
})
