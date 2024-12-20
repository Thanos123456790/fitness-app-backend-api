import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { clerkId, recommendation_id } = await request.json();

        if (!recommendation_id || !clerkId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400 }
            );
        }

        const response = await sql`
            INSERT INTO favourites (favourite_id, clerk_id) 
            VALUES (${recommendation_id}, ${clerkId});
        `;

        return new Response(JSON.stringify({ data: response }), { status: 201 });
    } catch (error) {
        console.error('Error creating favourite:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { clerkId, recommendation_id } = await request.json();

        if (!recommendation_id || !clerkId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400 }
            );
        }

        const response = await sql`
            DELETE FROM favourites 
            WHERE clerk_id = ${clerkId} 
            AND favourite_id = ${recommendation_id};
        `;

        return new Response(JSON.stringify({ data: response }), { status: 200 });
    } catch (error) {
        console.error('Error deleting favourite:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
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

        const favourites = await sql`
            SELECT favourite_id 
            FROM favourites 
            WHERE clerk_id = ${clerkId};
        `;

        return new Response(JSON.stringify(favourites), { status: 200 });
    } catch (error) {
        console.error('Error fetching favourites:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

