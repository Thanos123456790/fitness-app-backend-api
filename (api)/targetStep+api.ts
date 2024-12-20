import { neon } from "@neondatabase/serverless";

export async function PUT(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { clerkId, goal } = await request.json();
        if (!clerkId) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const response = await sql`
            UPDATE users
            SET 
                targetSteps = ${goal}
            WHERE 
                clerk_id = ${clerkId};
        `
        return new Response(JSON.stringify({ data: response }), {
            status: 201,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function GET(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { searchParams } = new URL(request.url);
        const clerkId = searchParams.get('clerkId');

        if (!clerkId) {
            return new Response(JSON.stringify({ error: 'Missing clerkId' }), { status: 400 });
        }

        const targetStep = await sql`
            SELECT targetsteps 
            FROM users 
            WHERE clerk_id = ${clerkId};
        `;
        console.log(targetStep);
        return new Response(JSON.stringify(targetStep), { status: 200 });
    } catch (error) {
        console.error('Error fetching favourites:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}