const api = {
    get: async (url, options) => {
        const res = await fetch(url, options)
        const data = await res.json()
        return data
    },
    post: async (url, body) => {
        const options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        }
        const res = await fetch(url, options)
        const data = await res.json()
        return data
    }
}

export default api