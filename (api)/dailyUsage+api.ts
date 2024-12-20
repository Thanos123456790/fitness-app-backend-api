import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const { clerkId,dailyUse,isDailyGoalAchieved,dailySteps } = await request.json();

        if (!clerkId) {
            return Response.json(
                { error: 'Missing required fields' },
                { status: 400 },
            );
        }

        const response = await sql`
            INSERT INTO dailytarget (
                clerk_id, 
                dailyUse, 
                isDailyGoalAchieved,
                dailySteps
            ) 
            VALUES (
                ${clerkId},
                ${dailyUse}, 
                ${isDailyGoalAchieved},
                ${dailySteps}
            );`;

        return new Response(JSON.stringify({ data: response }), {
            status: 201,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
