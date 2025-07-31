import { getSession } from "@solid-mediakit/auth";
import { json } from "@solidjs/router";
import { serverEnv } from "~/env/server";
import { authOptions } from "~/server/auth";
import * as jose from 'jose'

export async function ALL({ request }: { request: Request }) {

  const session = await getSession(request, authOptions)

  if (!session) {
    return json({
      success: false,
      message: "Session non trouvée",
    }, { status: 401 })
  }

  const providerId = session?.user?.providerId || ''

  const secret = Buffer.from(serverEnv.API_KEY, 'hex')
  try {

    const jwt = await new jose.EncryptJWT({
      sub: providerId,
    })
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .setIssuedAt()
      .setIssuer('valhalla_2')
      .setAudience('valhalla_1')
      .setExpirationTime('5m')
      .setSubject(providerId || '')
      .encrypt(secret)

    const path = request.url.replace(request.headers.get('referer') || '', '/')

    const url = serverEnv.URL_V1 + path

    const res = await fetch(url, {
      headers: {
        'Authorization-origin': 'valhalla_1',
        'Authorization': `Bearer ${jwt}`
      },
      method: request.method,
      body: request.body
    })

    const data = await res.json()

    return json(data);
  } catch (e) {
    console.log('pas de chance', e)
  }
}