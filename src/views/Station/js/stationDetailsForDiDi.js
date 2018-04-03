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
            'openLocation',
        ]
    },
    created() {
        var url = "https://mgoapi.18jian.cn/api-driver-web/station/stationInfo/" + sessionStorage.getItem("id");
        this.$http.get(url)
            .then((res) => {
                !res.data.data.imgUrl ? res.data.data.imgUrl = 'http://p1lw91kqi.bkt.clouddn.com/defaultPic.jpg' : '';
                this.stationInfo = Object.assign({}, this.stationInfo, res.data.data);
            })
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
        mapClick() {
            // 使用微信内置地图查看位置接口
        }
    }
});
