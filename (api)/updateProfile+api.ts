import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { field, value, clerkId } = await request.json();
        console.log(field, value);
        
        if (!clerkId || !field || typeof value === 'undefined') {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }
        
        // Validate that the field is a valid column (to prevent SQL injection)
        const allowedFields = ["name", "email", "gender", "weight", "height", "age"];
        if (!allowedFields.includes(field)) {
            return new Response(JSON.stringify({ error: 'Invalid field' }), { status: 400 });
        }

        // Dynamically build the query using the validated field
        const query = `UPDATE users SET ${field} = $1 WHERE clerk_id = $2`;
        const response = await sql(query, [value, clerkId]);

        return new Response(JSON.stringify({ data: response }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
