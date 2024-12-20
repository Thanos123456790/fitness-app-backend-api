import { neon } from "@neondatabase/serverless";

export async function PUT(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { clerkId, gender } = await request.json();
        if (!clerkId) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const response = await sql`
            UPDATE users
            SET 
                gender = ${gender}
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