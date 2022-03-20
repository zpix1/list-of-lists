export default async function fetchJson<JSON = unknown>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> {
    const response = await fetch(input, init);

    if (response.status === 401) {
        location.href = '/login';
    }

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    let data;
    try {
        data = await response.json();

        // response.ok is true when res.status is 2xx
        // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
        if (response.ok) {
            return data;
        }
    } catch (e) {
        if (e instanceof Error) {
            throw new FetchError({
                message: response.statusText,
                response,
                data: { message: e.toString() }
            });
        }
    }

    throw new FetchError({
        message: response.statusText,
        response,
        data
    });
}

export class FetchError extends Error {
    response: Response;
    data: {
        message: string
    };

    constructor({
                    message,
                    response,
                    data,
                }: {
        message: string
        response: Response
        data: {
            message: string
        }
    }) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError);
        }

        this.name = 'FetchError';
        this.response = response;
        this.data = data ?? { message: message };
    }
}
