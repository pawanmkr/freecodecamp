/*
 * Ignore this file this is just keeping the
 * server alive by mmaking continous request
 * because Render.com's free tier has limitations
 * and server shuts down after 15 minutes if not alive
 */
let count: number = 0;
export async function healthCheck(url: string) {
  console.log(count++);
  setTimeout(() => {
    fetch(url).then(() => {
      healthCheck(url);
    });
  }, 5000);
}
// https://fcc-lol8.onrender.com/health
