import { neon } from '@neondatabase/serverless';


export async function GET(request: Request) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { searchParams } = new URL(request.url);
        const clerkId = searchParams.get('clerkId');

        if (!clerkId) {
            return new Response(JSON.stringify({ error: 'Missing clerkId' }), { status: 400 });
        }
    try {
        const response = await sql`SELECT * FROM dailytarget where clerk_id=${clerkId} ORDER BY created_at DESC LIMIT 7;`;
        const averageSteps = response.reduce((acc, curr) => acc + curr.daily_steps, 0) / response.length;
        return new Response(JSON.stringify({ data: response, averageSteps }), { status: 200 });
    } catch (error) {
        console.error('Error fetching daily data:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
