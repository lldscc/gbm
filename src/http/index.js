import axios from 'axios'
import { userStore } from '@/store/user'
import { ElMessage } from 'element-plus'

// 创建axiso实例
const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 6000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const store = userStore(); // 确保Pinia实例已经注入
  if (store.token) {
    config.headers['Authorization'] = `${store.token}`;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 业务状态码判断
  const { code, message } = response.data
  if (code == 1) {
    ElMessage({
      message: message,
      type: 'warning',
      plain: true
    })
  }
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance