const http = require("http");

const PORT = 3000;

const server = http.createServer(async (request, response) => {
  // Главная страница
  if (request.method === "GET" && request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`
      <h1>Лекция 9 — ДЗ</h1>
      <p><a href="/weather">Погода (/weather)</a></p>

      <form action="/save" method="POST">
        <input name="username" placeholder="Ваше имя" />
        <button type="submit">Отправить</button>
      </form>
    `);
  }

  // Погода
  else if (request.method === "GET" && request.url === "/weather") {
    // пример из задания (Берлин)
    const latitude = 52.52;
    const longitude = 13.41;

    const apiUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
      const apiResponse = await fetch(apiUrl);
      const data = await apiResponse.json();

      const temp = data.current_weather.temperature;
      const wind = data.current_weather.windspeed;

      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(`
        <div style="font-family: Arial; max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px;">
          <h1>Погодный информер ☀️</h1>
          <p style="font-size: 18px;">
            В Берлине сейчас <b>${temp}°C</b>, ветер <b>${wind} км/ч</b>.
          </p>
          <p><a href="/">← На главную</a></p>
        </div>
      `);
    } catch (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Ошибка при получении погоды");
    }
  }

  // POST /save (как в лекции)
  else if (request.method === "POST" && request.url === "/save") {
    const body = [];

    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      const parsedBody = Buffer.concat(body).toString("utf-8");
      const decoded = decodeURIComponent(parsedBody).replace(/\+/g, " ");

      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(`Данные получены! Вы прислали: ${decoded}`);
    });
  }

  // 404
  else {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("404 Not Found");
  }
});

server.listen(PORT);
console.log(`Сервер запущен: http://localhost:${PORT}`);
