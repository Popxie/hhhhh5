new Vue({
    el: '#app',
    data: {
        userInfo: {
            username: 'admin',
            password: 'admin'
        },
    },
    created() {
        this.getList(this.userInfo);
    },
    methods: {
        getList(val) {
            let url = 'https://sit.mingbikes.com/api/login';
            axios.get(url, {params: val})
                .then((res) => {
                    console.debug(res)
                })
        }
    }
});
