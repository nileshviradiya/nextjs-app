import prisma from '../../../../lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const updatedData = await prisma.formData.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        message: data.message,
      }
    });

    return new Response(
      JSON.stringify(updatedData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating form data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update form data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}