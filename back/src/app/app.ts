import Koa = require('koa');
import Router = require('koa-router');
import bodyParser = require('koa-bodyparser');
import logger = require('koa-logger');
import json = require('koa-json');
import cors = require('koa2-cors');
const serve = require('koa-static');
const mount = require('koa-mount');
import HttpStatus = require('http-status');
import movieController from '../movie/movie.controller';

const app: Koa = new Koa();
const router = new Router();

// to serve static pages
const static_pages = new Koa();
static_pages.use(serve(__dirname + "/details")); //serve the build directory
app.use(mount("/", static_pages));

// Middlewares
app.use(cors()) // { allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'OPTION'] }
app.use(json());
app.use(logger());
app.use(bodyParser());

// Generic error handling middleware. 
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try { await next(); }
    catch (error) {
        ctx.status = error.statusCode ||
            error.status ||
            HttpStatus.INTERNAL_SERVER_ERROR;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
    }
});

/** Routes */
// Route middleware. 
app.use(movieController.routes());
app.use(movieController.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

router.get('/sentence', async (ctx: Koa.Context, next: () => Promise<any>) => {
    ctx.body = { path: '../index.html' };
    await next();
});

router.post('/data', async (ctx: Koa.Context, next: () => Promise<any>) => {
    ctx.body = { message: "This is your POST route, attached you can find the data you sent", body: ctx.request.body };
    await next();
});

// Application error logging. 
app.on('error', console.error);
export default app;
