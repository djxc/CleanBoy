import Axios from "axios";

const service = Axios.create({
    // baseURL: "http://localhost:8090", // api 的 base_url
    timeout: 12000 // request timeout //设置请求时长
})

service.interceptors.request.use(
    config => {
        // Do something before request is sent
        // if (store.getters.Token) {
        //     // 让每个请求携带token-- ['Token']为自定义key 请根据实际情况自行修改
        //     config.headers['与后端约定的token访问key'] = '拼接需要的访问key' + store.getters.Token === '' ? '' : '拼接需要的访问key' + store.getters.Token === undefined ? '' : '拼接需要的访问key' + store.getters.Token === null ? '' : '拼接需要的访问key' + store.getters.Token
        // }
        // 看项目实际情况 headers token头
        return config
    },
    error => {
        // Do something with request error
        // console.log(error) // for debug
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        // response 根据不同status 状态返回 对应不同的comfirm
        const res = response.data
        if (res.code === '后端返回的status或者code获取其他状态码') {
            // console.log('登录状态已过期')
        } else {
            return res
        }
    },
    error => {
        // console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default service