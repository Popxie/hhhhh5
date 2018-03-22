new Vue({
    el: '#app',
    data: {
        isShow: true,
        list: [
            {
                sonList: [
                    {
                        name: 'Coding.net代码托管',
                        link: 'https://coding.net',
                    },
                    {
                        name: '研发流程管理',
                        link: 'http://oa.xiaojubianli.com',
                    },
                    {
                        name: '文档中心',
                        link:
                            'http://doc.xiaojubianli.com/index.php?s=/Home/Item/index',
                    },
                    {
                        name: 'Jenkins集成编译',
                        link: 'http://tech.xiaojubianli.com/jenkins',
                    },
                ],
            },
            {
                sonList: [
                    {
                        name: 'Gitlab代码托管',
                        link: 'http://tech.xiaojubianli.com/gitlab/',
                    },
                    {
                        name: '私有Maven仓库',
                        link: 'http://tech.xiaojubianli.com/nexus/',
                    },
                    {
                        name: 'dubbo-admin',
                        link: 'http://tech.xiaojubianli.com/dubbokeeper/',
                    },
                    {
                        name: '配置中心',
                        link: 'http://conf.tech.mobilemart.cn/main.html',
                    },
                ],
            },
        ],
    },
    mounted() {},
    methods: {
        firstLineClick(item, index) {
            // window.location.href = item.link;
            window.open(item.link)
        },
        secondLineClick(item, index) {
            if (!item.link) {
                this.$message('暂时还未开放，敬请期待~ 😁')
            } else {
                window.location.href = item.link
            }
        },
    },
})
