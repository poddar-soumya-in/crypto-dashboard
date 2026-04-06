const BASE_URL = 'https://api.coingecko.com/api/v3'

export const apiClient = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    })

    if (!res.ok) {
        throw new Error('API Error')
    }

    return res.json()
}