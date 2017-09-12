const Koa = require('koa')
const app = new Koa()

const Router = require('koa-router')

const faker = require('faker');

const Mock = require('mockjs');
const Random = Mock.Random
//home
let home = new Router()
home.get('/', async (ctx) => {
    let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
    ctx.body = html
})
//others
let page = new Router()
page.get('/404', async (ctx) => {
    ctx.body = '404 page!'
})
page.get('/faker',async (ctx)=>{
    ctx.body={
        randomName:faker.name.findName(),
        randomEmail:faker.internet.email(),
        randomCard:faker.helpers.createCard()
    }
})
Random.extend({
    constellation: function(date) {
        var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
        return this.pick(constellations)
    }
})
page.get('/mock',async (ctx)=>{
    ctx.body=Mock.mock({
        'list|1-10': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': '@CONSTELLATION'
        }]
    })
})
page.get('/helloworld', async (ctx) => {
    ctx.body = 'helloworld page!'
})

//装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
    console.log('[demo] start-quick is starting at port 3000')
})