import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const formData = await prisma.formData.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(
      JSON.stringify(formData),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching form data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch form data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}