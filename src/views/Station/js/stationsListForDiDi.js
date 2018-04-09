new Vue({
    el: '#app',
    data: {
        isShowM: false,
        isShowSearch: false,
        isActive: false,
        dataList: [],
        total: '',
        pages: '',
        counts: 1,
        showLoading: false,
        showTitle: false,
        ajaxObj: {
            latitude: '30.2468997100', // 维度
            longitude: '120.1745423900', // 经度
            currentPage: 1,
            pageSize: 10,
        },
        api: {
            url: 'https://mgoapi.18jian.cn', // 线上
        },
        path: {
            distance: '/api-driver-web/station/station/distances', // 获取距离
        },
    },
    created() {
        const latitude = this.getQueryString('latitude')
        const longitude = this.getQueryString('longitude')
        this.ajaxObj.latitude = latitude
        this.ajaxObj.longitude = longitude
        sessionStorage.setItem('latitude', latitude)
        sessionStorage.setItem('longitude', longitude)
        this.getDataList(this.ajaxObj)
        console.log('latitude:1', latitude)
        console.log('longitude:2', longitude)

    },
    mounted() {
        let self = this
        window.onscroll = function() {
            let top =
                document.documentElement.scrollTop || document.body.scrollTop
            let canRemoveDistance =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight
            // 向上取整
            self.pages = Math.ceil(self.total / 10)
            if (self.counts < self.pages) {
                self.showLoading = true
            }
            if (top === canRemoveDistance && self.counts < self.pages) {
                self.counts++
                console.log('self.counts:', self.counts)
                setTimeout(() => {
                    self.ajaxObj.currentPage = self.counts
                    self.getDataList(self.ajaxObj)
                }, 1000)
            } else if (top == canRemoveDistance && self.counts >= self.pages) {
                self.showTitle = true
                self.showLoading = false
            }
        }
    },
    methods: {
        alertFn(msg) {
            this.$toast({
                message: msg,
                position: 'middle',
                duration: 2000,
            })
        },
        transferFn(data) {
            // 将参数格式化
            let result = ''
            for (let i in data) {
                result +=
                    encodeURIComponent(i) +
                    '=' +
                    encodeURIComponent(data[i]) +
                    '&'
            }
            return result
        },
        // 获取地址栏里面的参数
        getQueryString(name){
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var r = window.location.search.substr(1).match(reg)
            if (r != null) return unescape(r[2])
            return null
        },
        // 用户
        getDataList(val) {
            let self = this
            self.$http
                .get(this.api.url + this.path.distance, { params: val })
                .then(res => {
                    if (res.data.error_code === 0) {
                        res.data.data.data.forEach(item => {
                            if (!item.imgUrl) {
                                item.imgUrl =
                                    'http://p1lw91kqi.bkt.clouddn.com/defaultPic.jpg'
                            }
                            if (item.distance >= 1000) {
                                item.distance = (item.distance / 1000).toFixed(
                                    1,
                                )
                                item.showM = false
                            } else {
                                item.showM = true
                            }
                            this.dataList.push(item)
                        })
                        this.total = res.data.data.totalCount
                        this.isShowM = true
                        self.showLoading = false
                    } else {
                        this.alertFn(err.data.err_msg)
                    }
                })
                .catch(err => {
                    self.alertFn('系统异常，请稍后再试!')
                })
        },
        itemClick(item, index) {
            sessionStorage.setItem('id', item.id)
            window.location.href =
                // 'https://h5.xiaojubianli.com/stationForDiDi/Station/stationDetailsForDiDi.html'
                'http://192.168.1.118:3001/src/views/Station/stationDetailsForDiDi.html'
        },
    },
})
