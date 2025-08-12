const buildSpoonUrl = (baseUrl, apiKey, params) => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
        }
    });
    url.searchParams.append("number", 5);
    url.searchParams.append("apiKey", apiKey);
    return url.toString();
}

const queryHelper = {
    buildSpoonUrl
}

export default queryHelper;