const fetch = globalThis.fetch;
const key = "AIzaSyDILaSucASddFNg2AsgV7KKYVoiUuLmTv8";

(async () => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
})();