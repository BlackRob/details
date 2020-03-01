import Koa = require('koa');
import Router = require('koa-router');
import bodyParser = require('koa-bodyparser');
import logger = require('koa-logger');
import json = require('koa-json');
//const cors = require('koa-cors');
//const serve = require('koa-static');
//const mount = require('koa-mount');
//const HttpStatus = require('http-status');

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;

/* app.use(async (ctx: Koa.Context, next) => {
    // Log the request to the console
    console.log('Url:', ctx.url);
    // console.log(ctx);
    // Pass the request to the next middleware function
    await next();
}); */

/** Middlewares */
app.use(json());
app.use(logger());
app.use(bodyParser());

/* router.get('/*', async (ctx: Koa.Context) => {
    ctx.body = 'Hello Dickface!';
});
app.use(router.routes()); */

/** Routes */
app.use(router.routes()).use(router.allowedMethods());

router.get('/', async (ctx: Koa.Context, next: () => Promise<any>) => {
    ctx.body = { message: "This is your GET route" };
    await next();
});


router.post('/data', async (ctx: Koa.Context, next: () => Promise<any>) => {
    ctx.body = { message: "This is your POST route, attached you can find the data you sent", body: ctx.request.body };
    await next();
});

app.listen(PORT, () => console.log("Server started."));
