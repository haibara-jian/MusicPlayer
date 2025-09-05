const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// 导入路由
const musicAllRouter = require('./routes/musicAll');


const app = express();
const port = process.env.PORT || 3003;

// 中间件
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());


// 静态文件服务
//app.use('/file', express.static(path.join(__dirname, 'file')));
app.use(express.static(path.resolve(__dirname, './public')));

// 路由
app.use('/musicAll', musicAllRouter);

// 视图引擎设置
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));

// 路由处理
app.post('/config', (req, res) => {
    const data = req.body

    // 判断返回的对象是否为空
    if (JSON.stringify(data) === '{}') {
        return res.json({
            code: 400,
            msg: '提交失败',
            data: null
        })
    }

    // 写入cookie
    res.cookie('code', decodeURIComponent(data.code), { maxAge: 60 * 100 })

    res.json({
        code: 200,
        msg: '获取成功',
        data: data
    })
});

app.get('/', (req, res) => {
    const code = req.cookies['code'] ? decodeURIComponent(req.cookies['code']) : '<div id="xf-MusicPlayer" data-cdnName="https://music.huiyuan.cn.eu.org" data-localMusic="https://music.huiyuan.cn.eu.org/playlistData.json"></div><script src="https://music.huiyuan.cn.eu.org/xf-MusicPlayer/js/xf-MusicPlayer.min.js"></script>'
    res.render('index', { data: code })
});
// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: '音乐服务运行正常' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '端点不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(port, function() {
  console.log(`服务启动中... ${port}!`);
  console.log(`进程ID: ${process.pid}`);
});
