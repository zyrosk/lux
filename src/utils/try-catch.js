export default async function tryCatch(fn, rescue) {
  try {
    return await fn();
  } catch (err) {
    await rescue(err);
  }
}
