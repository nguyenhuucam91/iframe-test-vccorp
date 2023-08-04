const api = {
  get: async (url, options) => { 
    const res = await fetch(url, options)
    const data = await res.json()
    return data
  }
}

export default api