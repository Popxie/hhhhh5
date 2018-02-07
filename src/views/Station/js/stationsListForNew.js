new Vue({
    el: "#app",
    data: {
        visibleProvince: false,
        visibleCity: false,
        visibleArea: false,
        isShowM: false,
        isShowSearch: false,
        isActive: false,
        province: {
            provinceName: '',
            provinceId: '',
        },
        city: {
            cityName: '',
            cityId: '',
        },
        area: {
            areaName: '',
            areaId: ''
        },
        dataList: [],
        ProvinceList: [{
            flex: 1,
            data: [],
            values: [],
            className: 'slot',
        }],
        provinceObj: {},
        CityList: [{
            flex: 1,
            data: [],
            values: [],
            className: 'slot',
        }],
        cityObj: {},
        AreaList: [{
            flex: 1,
            data: [],
            values: [],
            className: 'slot',
        }],
        areaObj: {},
        jsApiList: [
            'onMenuShareAppMessage',
            'getLocation'
        ],
        total: '',
        pages: '',
        counts: 1,
        showLoading: false,
        showTitle: false,
        ajaxObj: {
            latitude: '30.2468997100',   // 维度
            longitude: '120.1745423900',  // 经度
            currentPage: 1,
            pageSize: 10,
        },
        cityId: '',
        isSendRequest: false,
        api: {
            // url: 'http://192.168.1.23:8080', // 本地
            url: 'http://test-api.xiaojubianli.com:8080', // 测试
            // url: 'https://mgoapi.18jian.cn', // 线上
        },
        path: {
            region: '/api-driver-web/station/region/',
            station: '/api-driver-web/station/station/',            // 获取默认省市的数据列表
            distance: '/api-driver-web/station/station/distances',   // 获取距离

            province: '/api-driver-web/station/province',       // 获取省份
            lowerLevel: '/api-driver-web/station/lowerLevel/'   // 获取 市。区列表
        }
    },
    created() {
        this.getProvinceList();
        this.getWeixinJsapiTicket();

        // 在浏览器测试的时候再打开 看下页面布局而已  将 isShowSearch = true;
        // this.getCityId('杭州市');

        // 测试专用 直接跳过微信sdk
        // this.getDataListByAgree(this.ajaxObj);
    },
    mounted() {
        let self = this
        if(!self.isShowSearch) {
            window.onscroll = function() {
                let top = document.documentElement.scrollTop || document.body.scrollTop;
                let canRemoveDistance = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                // 向上取整
                self.pages = Math.ceil(self.total/10)
                if(self.counts < self.pages) {
                    self.showLoading = true;
                }
                if(top === canRemoveDistance && self.counts < self.pages) {
                    self.counts++;
                    console.log('self.counts:', self.counts)
                    setTimeout( () => {
                        self.ajaxObj.currentPage = self.counts;
                        self.getDataListByAgree(self.ajaxObj);
                    }, 1000)
                } else if(top == canRemoveDistance && self.counts >= self.pages) {
                    self.showTitle = true;
                    self.showLoading = false;
                }

            }
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
        transferFn(data) {
            // 将参数格式化
            let result = '';
            for (let i in data) {
                result += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return result
        },
        // 1.1当用户拒绝获取gps的时候
        //  通过 ’杭州‘ 获取杭州市的 id
        getCityId(val) {
            this.$http.get(this.api.url + this.path.region + val)
                .then((res) => {
                    if (res.data.error_code === 0) {
                        this.cityId = res.data.data.id;
                        this.getDataList(this.cityId);
                    } else {
                        this.alertFn(err.data.err_msg)
                    }
                })
                .catch((err) => {
                    this.alertFn('系统异常，请稍后再试!')
                })
        },
        // 1.2 通过获取到的城市id来获取默认省市的数据
        getDataList(val) {
            this.$http.get(this.api.url + this.path.station + val)
                .then((res) => {
                    if (res.data.error_code === 0) {
                        // 每次请求前的清空下数组，不然数据会累加，在来回切换区域选择的时候
                        this.dataList = [];
                        res.data.data.forEach((item) => {
                            if(!item.imgUrl) {
                                item.imgUrl = 'http://p1lw91kqi.bkt.clouddn.com/defaultPic.jpg';
                            }
                            if(item.distance >= 1000) {
                                item.distance = (item.distance/1000).toFixed(1)
                                item.showM = false;
                            } else {
                                item.showM = true;
                            }
                            this.dataList.push(item);
                        })

                    } else {
                        this.alertFn(err.data.err_msg)
                    }
                })
                .catch((err) => {
                    this.alertFn('系统异常，请稍后再试!')
                })
        },
        // 用户 同意获取gps
        getDataListByAgree(val) {
            let self = this;
            self.$http.get(this.api.url + this.path.distance, { params: val })
                .then((res) => {
                    if (res.data.error_code === 0) {
                        res.data.data.data.forEach((item) => {
                            if(!item.imgUrl) {
                                item.imgUrl = 'http://p1lw91kqi.bkt.clouddn.com/defaultPic.jpg';
                            }
                            if(item.distance >= 1000) {
                                item.distance = (item.distance/1000).toFixed(1)
                                item.showM = false;
                            } else {
                                item.showM = true;
                            }
                            this.dataList.push(item);
                        })
                        this.total = res.data.data.totalCount;
                        self.showLoading = false;
                    } else {
                        this.alertFn(err.data.err_msg)
                    }
                })
                .catch((err) => {
                    self.alertFn('系统异常3，请稍后再试!')
                })
        },
        // 获取微信tick，完成验签
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
                    self.alertFn('系统异常，请稍后再试!')
                });
        },
        wxReady() {
            let self = this;
            wx.ready(() => {
                var imgUrl = "http://p1z99s8tj.bkt.clouddn.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180120180458.png";
                var link = window.location.href;
                var desc = "Mobile Go魔急便(MGO)是小桔便利在中国市场推出的第一款车载便利品牌。产品由智能车载盒子和销售/馈赠商品组成。";
                // 朋友
                wx.onMenuShareAppMessage({
                    title: "魔急便站点查询", // 分享标题
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
                // 获取位置
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        self.ajaxObj.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        self.ajaxObj.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        self.isShowM = true;
                        self.isShowSearch = false;
                        self.isActive = true;

                        // 用户同意获取GPS以后，请求当前gps区域的数据
                        self.getDataListByAgree(self.ajaxObj);
                    },
                    // 用户拒绝获取gps
                    cancel: function (cancel) {
                        self.isShowM = false;
                        self.isShowSearch = true;
                        // 用户拒绝获取地理位置时
                        self.getCityId('杭州市');
                    },
                    // 获取gps接口失败
                    fail: function (fail) {
                        self.isShowM = false;
                        self.isShowSearch = true;
                        self.getCityId('杭州市');
                    }
                });
            })
        },
        isSendClick() {
            this.isSendRequest = true;
        },
        onProvinceChange(picker, values) {
            if (values[0]) {
                let obj = {
                    id: '',
                    region: '',
                }
                obj.region = values[0];
                this.ProvinceList[0].data.forEach((item) => {
                    if (item.region === obj.region) {
                        obj.id = item.id;
                    }
                })
                this.provinceObj = Object.assign({}, this.provinceObj, obj);
            }
        },
        onCityChange(picker, values) {
            if (values[0]) {
                let obj = {
                    id: '',
                    region: '',
                }
                obj.region = values[0];
                this.CityList[0].data.forEach((item) => {
                    if (item.region === obj.region) {
                        obj.id = item.id;
                    }
                })
                this.cityObj = Object.assign({}, this.cityObj, obj);
            }
        },
        onAreaChange(picker, values) {
            if (values[0]) {
                let obj = {
                    id: '',
                    region: '',
                }
                obj.region = values[0];
                this.AreaList[0].data.forEach((item) => {
                    if (item.region === obj.region) {
                        obj.id = item.id;
                    } else if (item.region === '全区') {
                        obj.id = this.cityObj.id;
                    }
                })
                this.areaObj = Object.assign({}, this.cityObj, obj);
            }
        },
        // 获取省份列表
        getProvinceList() {
            this.$http.get(this.api.url + this.path.province)
                .then(function (res) {
                    if (res.data.error_code === 0) {
                        this.ProvinceList[0].data = res.data.data;
                        res.data.data.forEach((item) => {
                            this.ProvinceList[0].values.push(item.region);
                        })
                        this.province.provinceName = '浙江省';
                        // 获取到省份列表以后 立刻通过省份id 获取 市列表 用于回显默认省，市
                        this.getCityList(13780, 'city');
                        this.city.cityName = '杭州市';
                        // 通过cityId  获取区域列表 （默认杭州市全区）
                        this.getAreaList(13781, 'area');
                        this.area.areaName = '全区';
                    } else {
                        this.alertFn(err.data.err_msg)
                    }

                }).catch(() => {
                    this.alertFn('系统异常，请稍后再试!')
                });
        },
        // 获取城市列表
        getCityList(val) {
            let self = this;
            self.$http.get(this.api.url + this.path.lowerLevel + val)
                .then((res) => {
                    if (res.data.error_code === 0) {
                        self.CityList[0].data = res.data.data;
                        if (res.data.data) {
                            res.data.data.forEach((item) => {
                                self.CityList[0].values.push(item.region);
                                if (item.isCapital === 1) {
                                    self.city.cityName = item.region;
                                    self.area.areaName = '全区';
                                    self.getAreaList(item.id);
                                    // 用户一旦切换省份，(默认选择省会)就获取当前省会的所有站点列表
                                    if (self.isSendRequest) {
                                        // 这里之所以这么做就是为了避免 在拒绝获取gps之前就发起该请求（防止第一次页面加载就请求这个接口，因为再created的 getProvinceList里面已经触发了一次这个接口，所以为了避免在还没有点击拒绝获取gps前就显示默认的杭州站点列表数据）
                                        self.getDataList(item.id);
                                    }
                                }
                            })
                        }

                    } else {
                        self.$toast({ message: res.data.err_msg });
                        self.city.cityName = '';
                        self.area.areaName = '';
                        self.AreaList[0].values = [];
                    }
                }, (err) => {

                })
        },
        // 获取 区域列表
        getAreaList(val) {
            this.$http.get(this.api.url + this.path.lowerLevel + val)
                .then((res) => {
                    if (res.data.error_code === 0) {
                        this.AreaList[0].values = [];
                        this.AreaList[0].data = res.data.data;
                        if (res.data.data) {
                            this.AreaList[0].values.push('全区');
                            res.data.data.forEach((item) => {
                                // 将所得到的 区域名 抽离出来，给组件用
                                this.AreaList[0].values.push(item.region);
                            })
                        }
                    } else {
                        this.$toast({
                            message: res.data.err_msg,
                        });
                        this.area.areaName = '';
                    }
                }, (err) => {

                })
        },
        chooseProvince() {
            this.visibleProvince = true;
        },
        chooseCity() {
            this.visibleCity = true;
        },
        chooseDetails() {
            this.visibleArea = true;
        },
        itemClick(item, index) {
            sessionStorage.setItem('id', item.id);
            // window.location.href = 'http://192.168.1.16:3001/src/views/Station/stationDetails.html';
            // window.location.href = 'https://mgo.18jian.cn/station/Station/stationDetails.html';
            window.location.href = 'https://h5.xiaojubianli.com/station/Station/stationDetails.html';

        },
        cancleClick() {
            this.visibleArea = this.visibleCity = this.visibleProvince = false;
        },
        confirmClick(val) {
            if (val === 'province') {
                this.province.provinceName = this.provinceObj.region;
                this.province.provinceId = this.provinceObj.id;
                this.visibleProvince = false;
                this.CityList[0].values = [];
                this.getCityList(this.province.provinceId);

            } else if (val === 'city') {
                this.city.cityName = this.cityObj.region;
                this.city.cityId = this.cityObj.id;
                this.visibleCity = false;
                this.AreaList[0].values = [];
                this.getAreaList(this.city.cityId);
            } else {
                this.area.areaName = this.areaObj.region;
                this.area.areaId = this.areaObj.id;
                this.visibleArea = false;
                // 请求接口获取当前 市或区的 数据
                if (this.area.areaName !== '全区') {
                    this.getDataList(this.area.areaId);
                } else {
                    // 组件的特性一旦进入页面就会触发 onProvinceChange onCityChange onAreaChange 所以当市的列表有数据的时候就可以拿到当前市的id (因为再触发她们的时候已经多数据做了赋值处理)
                    this.getDataList(this.cityObj.id);
                }
            }

        }
    }
});
