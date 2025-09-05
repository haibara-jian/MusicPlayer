const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// 导入路由
const musicAllRouter = require('./routes/musicAll');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/public', express.static(path.join(__dirname, 'public')));

// 路由
app.use('/musicAll', musicAllRouter);

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

app.listen(PORT, () => {
  console.log(`音乐服务运行在端口 ${PORT}`);
});
