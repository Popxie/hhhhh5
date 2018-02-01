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
        // var url = "http://test-api.xiaojubianli.com:8080/api-driver-web/station/stationInfo/" + sessionStorage.getItem("id");
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
            wx.openLocation({
                latitude: this.stationInfo.latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: this.stationInfo.longitude, // 经度，浮点数，范围为180 ~ -180。
                name: this.stationInfo.name, // 位置名
                address: this.stationInfo.address, // 地址详情说明
                scale: 17, // 地图缩放级别,整形值,范围从1~28。默认为最大
                // infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        }
    }
});
