new Vue({
    el: '#app',
    data: {
        isShow: true,
        list: [
            {
                sonList: [
                    {
                        name: '文档中心_YApi',
                        link: 'http://47.98.215.226:8080/group/69'
                    },
                    {
                        name: '文档中心_showDoc',
                        link:
                            'http://doc.xiaojubianli.com/index.php?s=/Home/Item/index',
                    },
                    {
                        name: '禅道',
                        link: 'http://oa.xiaojubianli.com/www/index.php?m=my&f=index',
                    },
                    {
                        name: 'Gitlab代码托管',
                        link: 'http://tech.xiaojubianli.com/gitlab',
                    },

                ],
            },
            {
                sonList: [
                    {
                        name: 'Jenkins集成编译',
                        link: 'http://tech.xiaojubianli.com/jenkins',
                    },
                    {
                        name: '私有Maven仓库',
                        link: 'http://tech.xiaojubianli.com/nexus',
                    },
                    {
                        name: 'dubbo-admin',
                        link: 'http://tech.xiaojubianli.com/dubbokeeper',
                    },
                    {
                        name: '七牛云',
                        link: 'https://portal.qiniu.com/create',
                    },
                ],
            },
            {
                sonList: [
                    {
                        name: '配置中心',
                        link: 'http://conf.tech.mobilemart.cn/main.html',
                    },

                    {
                        name: '阿里邮箱',
                        link: 'http://mail.xiaojubianli.com'
                    },
                    {
                        name: 'Coding.net代码托管',
                        link: 'https://coding.net',
                    },
                    {
                        name: '待开发~',
                    }
                ],
            }
        ],
    },
    mounted() {},
    methods: {
        itemClick(item, index) {
            if (item.link) {
                window.open(item.link)
                return
            }
            this.$notify({
                title: '抱歉！',
                message: '该链接暂时不存在~🤪',
                type: 'warning',
            })
        },
    },
})
