import axios from 'axios'
import router from '../router/router'
import bus from '../components/common/bus/bus'
import { Message,Loading} from 'element-ui';

let loading        //定义loading变量

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(218, 217, 217, 0.6)'
    })
}
function endLoading() {
    loading.close()
}

let needLoadingRequestCount = 0
// export function showFullScreenLoading() {
//     if (needLoadingRequestCount === 0) {
//         startLoading()
//     }
//     needLoadingRequestCount++
// }

// export function tryHideFullScreenLoading() {
//     if (needLoadingRequestCount <= 0) return
//     needLoadingRequestCount--
//     if (needLoadingRequestCount === 0) {
//         endLoading()
//     }
// }

function changeToFormData(obj) {
    let data = new FormData();

    obj && Object.keys(obj).forEach(o => {
        data.append( o,obj[o])
    })
    return data;
}

//设置content-type = multipart/form-data
axios.defaults.headers['Content-Type'] = 'multipart/form-data'
// 添加一个请求拦截器
axios.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        if(config.method == 'post') {
            if(config.responseType != 'blob'){
                config.data = changeToFormData(config.data);
            }
        }
        // showFullScreenLoading()
        return config;
    },  (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// 添加一个响应拦截器
axios.interceptors.response.use(
    (response) => {
        // Do something with response data
        tryHideFullScreenLoading()
        return response;
    }, (error) => {
        // Do something with response error
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 转到登录页面
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
                    break
                case 502:
                    Message.error('请求失败，请联系技术人员!')
                    return false
                case 504:
                    Message.error('请求失败，请联系技术人员!')
                    return false
            }
        }
        return Promise.reject(error);
    }
);

let ajaxMethods = ['post','get'];
let api = {};

ajaxMethods.forEach((method) => {
    api[method] =  (uri, data, config) => {
        return new Promise( (resolve, reject) => {
            let ajaxPromise;
            if(method === 'get'){
                data = {
                    params:data
                };
                ajaxPromise = axios.get(uri,data)

            }else if(method === 'post'){
                ajaxPromise = axios.post(uri, data, config)
            }
            ajaxPromise.then((response)=> {
                //正常返回,则resolve promise
                // if(response.data.resCode === '000000' || (!response.config.responseType && response.status == 200)) {
                if(response.data.resCode === '000000' || (typeof (response.data) == 'string' && response.status == 200)) {
                    resolve(response);
                }
                //session过期，弹框登录
                if(response.data.resCode === '008004'){
                    bus.$emit('loginDialog', true);
                }
                //用户不存在或未启用
                if(response.data.resCode === '008001'){
                    Message.error('用户不存在或未启用')
                    return false
                }
                //非正常返回，则reject promise
                reject(response);
            }).catch((response)=> {
                reject(response);
            })
        })
    }
})



export default api;