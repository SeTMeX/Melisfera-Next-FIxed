import axios from 'axios'

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8888/api'
  }

  // Auth endpoints
  async register(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber?: string
  }) {
    const response = await axios.post(`${this.baseURL}/auth/register`, data)
    return response.data
  }

  async login(data: { email: string; password: string }) {
    const response = await axios.post(`${this.baseURL}/auth/login`, data, {
      withCredentials: true // Important for cookies
    })
    return response.data
  }

  async logout() {
    const response = await axios.post(`${this.baseURL}/auth/logout`, {}, {
      withCredentials: true
    })
    return response.data
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(`${this.baseURL}/auth/me`, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      return null
    }
  }

  // User endpoints
  async getProfile() {
    const response = await axios.get(`${this.baseURL}/user/profile`, {
      withCredentials: true
    })
    return response.data
  }

  async updateProfile(data: {
    firstName?: string
    lastName?: string
    phoneNumber?: string
  }) {
    const response = await axios.patch(`${this.baseURL}/user/profile`, data, {
      withCredentials: true
    })
    return response.data
  }

  async deleteAccount() {
    const response = await axios.delete(`${this.baseURL}/user/profile`, {
      withCredentials: true
    })
    return response.data
  }

  // Products endpoints
  async getProducts(params?: { inStockOnly?: boolean; lang?: string }) {
    const response = await axios.get(`${this.baseURL}/products`, { params })
    return response.data
  }

  async getProduct(id: string) {
    const response = await axios.get(`${this.baseURL}/products/${id}`)
    return response.data
  }

  async createProduct(data: any) {
    const response = await axios.post(`${this.baseURL}/products`, data, {
      withCredentials: true
    })
    return response.data
  }

  async updateProduct(id: string, data: any) {
    const response = await axios.put(`${this.baseURL}/products/${id}`, data, {
      withCredentials: true
    })
    return response.data
  }

  async deleteProduct(id: string) {
    const response = await axios.delete(`${this.baseURL}/products/${id}`, {
      withCredentials: true
    })
    return response.data
  }

  // Favorites endpoints
  async getFavorites() {
    const response = await axios.get(`${this.baseURL}/favorites`, {
      withCredentials: true
    })
    return response.data
  }

  async addToFavorites(productId: string) {
    const response = await axios.post(`${this.baseURL}/favorites`, { productId }, {
      withCredentials: true
    })
    return response.data
  }

  async removeFromFavorites(productId: string) {
    const response = await axios.delete(`${this.baseURL}/favorites/${productId}`, {
      withCredentials: true
    })
    return response.data
  }

  // Cart endpoints
  async getCart() {
    const response = await axios.get(`${this.baseURL}/cart`, {
      withCredentials: true
    })
    return response.data
  }

  async addToCart(productId: string, quantity: number) {
    const response = await axios.post(`${this.baseURL}/cart`, { productId, quantity }, {
      withCredentials: true
    })
    return response.data
  }

  async removeFromCart(productId: string) {
    const response = await axios.delete(`${this.baseURL}/cart/${productId}`, {
      withCredentials: true
    })
    return response.data
  }

  // Orders endpoints
  async getOrders() {
    const response = await axios.get(`${this.baseURL}/orders`, {
      withCredentials: true
    })
    return response.data
  }

  async createOrder(data: {
    items: Array<{ productId: string; quantity: number }>
    shippingAddress: {
      street: string
      city: string
      postalCode: string
      country: string
    }
  }) {
    const response = await axios.post(`${this.baseURL}/orders`, data, {
      withCredentials: true
    })
    return response.data
  }

  // Wallet endpoints
  async getWallet() {
    const response = await axios.get(`${this.baseURL}/wallet`, {
      withCredentials: true
    })
    return response.data
  }

  async addFunds(amount: number, description?: string) {
    const response = await axios.post(`${this.baseURL}/wallet`, { amount, description }, {
      withCredentials: true
    })
    return response.data
  }
}

export const apiClient = new ApiClient()
