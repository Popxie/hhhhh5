new Vue({
    el: '#app',
    data: {
        id: null,
        stationInfo: {
            name: '',
            stationTel: '',
            workTimeDesc: '',
            address: '',
            imgUrl: '',
            addressCopy: '',
        },
    },
    created() {
        const apiUrl = 'https://mgoapi.18jian.cn/api-driver-web/station/stationInfo/'
        const defaultPic = 'http://p1lw91kqi.bkt.clouddn.com/defaultPic.jpg'
        const url = apiUrl + sessionStorage.getItem('id')
        this.$http.get(url).then(res => {
            !res.data.data.imgUrl ? (res.data.data.imgUrl = defaultPic) : ''
            this.stationInfo = Object.assign({}, this.stationInfo, res.data.data)
            this.judgeWidth()
        })
    },
    methods: {
        alertFn(msg) {
            this.$toast({
                message: msg,
                position: 'middle',
                duration: 2000,
            })
        },
        clipboardFn(className, success, fail) {
            const clipboard = new Clipboard(className)
            clipboard.on('success', e => {
                e.clearSelection()
                typeof success == 'function' && success()
                this.alertFn('已复制到剪贴板')
            })
            clipboard.on('error', e => {
                typeof fail == 'function' && fail()
                this.alertFn('复制失败')
            })
        },
        judgeWidth() {
            const width = window.screen.width
            const length = this.stationInfo.address.length
            const address = this.stationInfo.address
            if (width < 375) {
                if (length > 20) {
                    this.stationInfo.addressCopy = this.adrSeparate(this.stationInfo.address, 20)
                    return
                }
                this.stationInfo.addressCopy = address
            }
            if (length > 22) {
                this.stationInfo.addressCopy = this.adrSeparate(this.stationInfo.address, 22)
                return
            }
            this.stationInfo.addressCopy = address

        },
        adrSeparate(str, num) {
            if (num) {
                return str.substr(0, num) + '···'
            }
            return str
        },
        mapClick() {
            this.clipboardFn('.stationName')
        },
    },
})
