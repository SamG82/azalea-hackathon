const axios = require('axios')

class FHIRClient {
    constructor(base_url, token) {
        this.axios = axios.create({
            baseURL: base_url,
            headers: {'Authorization': `Bearer ${token}`}
        })
    }
}

module.exports = FHIRClient