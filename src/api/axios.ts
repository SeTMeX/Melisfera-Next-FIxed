import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL??'http://localhost:8888/api',
    timeout: 10000
})

api.interceptors.request.use(
    (config)=>{
        // For server-side requests, we'll handle token in the API routes
        // For client-side, we can get from cookies if needed
        return config
    },
    (error)=>{

        return Promise.reject(error)
    }

)

api.interceptors.response.use(
    (response)=>{
        return Promise.resolve(response)
    },
    (error)=>{
        // if(error.response.status===401){}
        return Promise.reject(error)
    }
)

export default api