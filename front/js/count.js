(function() {
    const script = document.currentScript;
    const baseURL = script.getAttribute('data-base-url') || 'https://count.666860.xyz';
    const pagePVId = script.getAttribute('data-page-pv-id') || 'page_pv';
    const pageUVId = script.getAttribute('data-page-uv-id') || 'page_uv';

    const tracker = {
        page_pv_id: pagePVId,
        page_uv_id: pageUVId,
        init: async function() {
            const locationInfo = getLocation(window.location.href);
            const pvElement = document.getElementById(this.page_pv_id);
            const uvElement = document.getElementById(this.page_uv_id);
            const payload = {
                url: locationInfo.pathname,
                hostname: locationInfo.hostname,
                referrer: document.referrer,
                pv: !!pvElement,
                uv: !!uvElement
            };

            try {
                const response = await fetch(`${baseURL}/api/visit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (data.ret === "OK") {
                    if (pvElement) pvElement.innerText = data.data.pv;
                    if (uvElement) uvElement.innerText = data.data.uv;
                } else {
                    console.error("WebViso.init error", data.message);
                }
            } catch (error) {
                console.error("WebViso.init fetch error", error);
            }
        }
    };

    const getLocation = function(url) {
        const anchor = document.createElement('a');
        anchor.href = url;
        return anchor;
    };

    if (typeof window !== "undefined") {
        tracker.init();
        window.WebViso = tracker;
    }
})();