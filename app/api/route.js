import Ably from 'ably';
import { NextResponse } from 'next/server';
import { LiveObjects } from 'ably/liveobjects';

// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on client side
export const revalidate = 0;


export async function GET(request) {
  try {
    const client = new Ably.Rest(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: 'ably-nextjs-demo',
      plugins: { LiveObjects },
    });
    console.log(`Request: ${JSON.stringify(tokenRequestData)}`);
    return NextResponse.json(tokenRequestData);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }

}
