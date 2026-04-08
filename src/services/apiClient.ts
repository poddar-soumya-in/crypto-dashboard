const BASE_URL = 'https://api.coingecko.com/api/v3'

class ApiError extends Error {
    status: number
    data?: any

    constructor(message: string, status: number = 0, data?: any) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.data = data
    }
}

export const apiClient = async <T = any>(
    endpoint: string,
    options: RequestInit = {},
    timeout = 10000
): Promise<T> => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            signal: controller.signal,
            ...options,
        })

        const contentType = res.headers.get('content-type')
        let data: any = null

        // Safely parse response
        if (contentType?.includes('application/json')) {
            try {
                data = await res.json()
            } catch {
                throw new ApiError('Invalid JSON response', res.status)
            }
        } else {
            data = await res.text()
        }

        if (!res.ok) {
            // Handle specific status codes
            switch (res.status) {
                case 400:
                    throw new ApiError('Bad Request', res.status, data)
                case 401:
                    throw new ApiError('Unauthorized', res.status, data)
                case 403:
                    throw new ApiError('Forbidden', res.status, data)
                case 404:
                    throw new ApiError('Not Found', res.status, data)
                case 429:
                    throw new ApiError('Rate Limited', res.status, data)
                case 500:
                case 502:
                case 503:
                case 504:
                    throw new ApiError('Server Error', res.status, data)
                default:
                    throw new ApiError('Unknown API Error', res.status, data)
            }
        }

        return data as T
    } catch (err: any) {
        // Handle abort (timeout)
        if (err.name === 'AbortError') {
            throw new ApiError('Request timeout')
        }

        // Handle network errors
        if (err instanceof TypeError) {
            throw new ApiError('Network error')
        }

        // Re-throw known errors
        if (err instanceof ApiError) {
            throw err
        }

        // Fallback
        throw new ApiError(err.message || 'Unexpected error')
    } finally {
        clearTimeout(id)
    }
}