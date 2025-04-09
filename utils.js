/**
 * whether the hostname is allowed
 * @param {String} hostname example.com
 * @param {Array} allowedReferrers allowed referrers
 * @returns
 */
export function isAllowedHost(hostname, allowedReferrers = []) {
  if (allowedReferrers.length === 0) {
    return true
  }
  const regExp = new RegExp(allowedReferrers.join('|'), 'g')
  // if hostname matches allowed referrers
  if (!hostname || regExp.test(hostname)) {
    return true
  }
  for (const referrer of allowedReferrers) {
    // if hostname end with allowed referrers
    if (hostname.endsWith(referrer)) {
      return true
    }
  }
  return false
}

/**
 * fetch and apply the response
 * @param {Object} request Vercel Edge Function request
 * @param {String} host the upstream host to fetch
 * @param {Array} allowedReferrers allowed referrers
 * @returns
 */
export async function fetchAndApply(request, host, allowedReferrers = []) {
  let response = null
  let url = new URL(request.url)

  url.host = host
  let method = request.method
  let request_headers = request.headers
  let new_request_headers = new Headers(request_headers)
  new_request_headers.set('Host', host)
  new_request_headers.set('Referer', url.href)
  let original_response = await fetch(url.href, {
    method: method,
    headers: new_request_headers,
  })

  let original_response_clone = original_response.clone()
  let original_text = null
  let response_headers = original_response.headers
  let new_response_headers = new Headers(response_headers)
  let status = original_response.status

  const hostname = (() => {
    try {
      return new URL(request.headers.get('Referer')).hostname
    } catch (e) {
      return ''
    }
  })()
  if (!isAllowedHost(hostname, allowedReferrers)) {
    return new Response(`403 Forbidden: ${hostname}`, {
      headers: { 'Content-Type': 'text/html' },
      status: 403,
      statusText: 'Forbidden',
    })
  }

  new_response_headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  new_response_headers.set('Access-Control-Allow-Headers', 'Content-Type')
  new_response_headers.set('Cache-Control', 'max-age=600, s-maxage=2592000, stale-while-revalidate')
  new_response_headers.delete('link')

  original_text = original_response_clone.body

  response = new Response(original_text, {
    status,
    headers: new_response_headers,
  })

  return response
}
