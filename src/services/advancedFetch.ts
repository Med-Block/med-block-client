export default async function advancedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
        const response = await fetch(input, init);

        if (response.status === 401) {
            const allowedRoutes = ['log-in'];
            localStorage.removeItem('token');

            if (!allowedRoutes.includes(window.location.pathname.split('/')[1])) {
                window.location.replace('/log-in');
            }
        }

        return response;
    } catch (error) {
        throw new Error(String(error));
    }
}
