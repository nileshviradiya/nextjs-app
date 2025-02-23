import prisma from '../../../lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Form data received:", data);

    const savedData = await prisma.formData.create({
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
      JSON.stringify({ success: true, message: "Form data stored in the database", data: savedData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error storing form data:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to store form data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
 