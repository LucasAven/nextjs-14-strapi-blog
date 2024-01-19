"use server";

export async function suscribeEmail(
  currentState: { failed: boolean; message: string },
  formData: FormData,
) {
  const email = formData.get("email");
  // eslint-disable-next-line no-console
  console.log("suscribeEmail from server", email);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // eslint-disable-next-line sort-keys
  return { message: `Email ${email} suscribed!`, failed: false };
}
