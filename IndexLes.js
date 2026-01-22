const http = require("http");

const PORT = 3000;

const server = http.createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/') {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
         response.statusCode = (200);    

        response.end(`
            <form action="/save" method="POST">
                <input name="username" placeholder="Ваше имя" />
                <button type="submit">Отправить</button>
            </form>
        `)
    } else if (request.method === 'POST' && request.url === '/save') {
        const body = [];
        
        request.on('data', (chunk) => {
            body.push(chunk);
           // console.log(`Прилетел кусочек данных: ${chunk}`);
        });

        request.on('end', () => {

            const parsedBody = Buffer.concat(body).toString('utf-8');
            const decodedString = decodeURIComponent(parsedBody);

            console.log(`Полное тело запроса: ${decodedString}`);

            response.setHeader('Content-Type', 'text/plain; charset=utf-8');
            response.statusCode = (200);

            response.end(`Данные получены! Вы прислали: ${decodedString}`);
        });
    } else if (request.method === 'GET' && 
        (request.url === '/servers' || request.url === '/users')) {
        const data = await fetch('https://gusic.xyz/stats');
        const jsonData = await data.json();

        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.statusCode = (200); 

        const testTern = request.url === '/servers' ? 'Это правда' : 'Это не правда';

        if (request.url === '/servers') {
            response.end(`<h1>Количество серверов на данный момент: ${jsonData.servers}</h1>`)
        } else if (request.url === '/users') {
            response.end(
                `<h1>Количество пользователей на данный момент: ${jsonData.users}</h1>`
            );
        }                        
    } 
});

server.listen(PORT);
console.log(`Сервер был запущен по адресу: http://localhost:${PORT}`);