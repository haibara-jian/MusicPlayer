



基于deepseek ai生成并修改达到可用状态，此项目用于匹配 https://gitee.com/xfwlclub/xf-MusicPlayer 项目 api。

完整版，需要修改所有的music.huiyuan.cn.eu.org为你的域名

参考命令

find ./ -type f |xargs grep "music.huiyuan.cn.eu.org"

查询结果请查看result.txt

参考nginx 转发
```
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl ;
    server_name api.xxx.com;
    ssl_certificate /etc/nginx/cert/xxx.com.pem;
    ssl_certificate_key /etc/nginx/cert/xxx.com.key;

    location / {
                    proxy_pass              http://127.0.0.1:3003;
                    proxy_set_header        Host            $host;
                    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
                    proxy_set_header        X-Forwarded-For $remote_addr;
                    add_header              X-Frame-Options SAMEORIGIN;

    }
}
```


口令为：

帮忙弄一个音乐类型的项目，基于Node.js + Express 扩展，功能包含读取多个json文件实现歌词获取 /musicAll/?lyric=1404206986 和歌单获取/musicAll/?playlistId=14189826720 ，还能支持获取歌曲MP3文件和专辑图JPG等静态文件获取，支持通过/musicAll/?songId=1404206986&mp3Url=mp3响应302location到/public/music/1404206986.mp3


# Node.js 音乐服务项目

我将为您设计一个基于Node.js + Express的音乐服务项目，支持歌词获取、歌单管理、MP3文件服务和专辑图像服务。

## 项目设计与实现

### 项目结构
```
music-project/
├── app.js                 # 主应用文件
├── package.json           # 项目依赖配置
├── data/                  # 数据存储目录
│   ├── lyrics/           # 歌词JSON文件
│   └── playlists/        # 歌单JSON文件
├── public/               # 静态资源目录
│   ├── music/           # MP3文件存储
│   └── images/          # 专辑图像存储
└── routes/               # 路由文件
    └── musicAll.js      # 音乐API路由
```

### 核心代码实现

#### 1. package.json
```json
{
  "name": "music-service",
  "version": "1.0.0",
  "description": "音乐服务API，支持歌词、歌单和音频文件获取",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

#### 2. app.js (主应用文件)
```javascript
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
```

#### 3. routes/musicAll.js (API路由)
```javascript
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// 获取歌词
router.get('/', async (req, res) => {
  try {
    const { lyric, playlistId, songId, mp3Url } = req.query;
    
    if (lyric) {
      // 获取歌词逻辑
      const lyricPath = path.join(__dirname, '../data/lyrics', `${lyric}.json`);
      try {
        const data = await fs.readFile(lyricPath, 'utf8');
        const lyricData = JSON.parse(data);
        res.json(lyricData);
      } catch (error) {
        res.status(404).json({ error: '歌词不存在' });
      }
    } 
    else if (playlistId) {
      // 获取歌单逻辑
      const playlistPath = path.join(__dirname, '../data/playlists', `${playlistId}.json`);
      try {
        const data = await fs.readFile(playlistPath, 'utf8');
        const playlistData = JSON.parse(data);
        res.json(playlistData);
      } catch (error) {
        res.status(404).json({ error: '歌单不存在' });
      }
    }
    else if (songId && mp3Url === 'mp3') {
      // 重定向到MP3文件
      const mp3Path = `/public/music/${songId}.mp3`;
      res.redirect(302, mp3Path);
    }
    else {
      res.status(400).json({ error: '无效的请求参数' });
    }
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;
```

#### 4. 示例数据文件

data/lyrics/1404206986.json:
```json
{
  "id": "1404206986",
  "title": "示例歌曲",
  "artist": "示例歌手",
  "album": "示例专辑",
  "lyrics": [
    {"time": "00:00:00", "text": "歌曲开始..."},
    {"time": "00:00:15", "text": "第一句歌词"},
    {"time": "00:00:30", "text": "第二句歌词"}
  ]
}
```

data/playlists/14189826720.json:
```json
{
  "id": "14189826720",
  "name": "我的歌单",
  "creator": "用户123",
  "songs": [
    {"id": "1404206986", "title": "示例歌曲", "artist": "示例歌手"},
    {"id": "1404206987", "title": "另一首歌曲", "artist": "另一位歌手"}
  ]
}
```

### 安装与运行

1. 安装依赖：
```bash
npm install
```

2. 创建目录结构：
```bash
mkdir -p data/lyrics data/playlists public/music public/images
```

3. 添加示例数据文件（如上所示）

4. 启动服务：

   
安装pm2来进行服务托管

参考命令
```
# 全局安装 PM2
npm install -g pm2

# 使用 PM2 启动应用
pm2 start main.js --name "music-app"

# 设置开机自启动
pm2 startup
pm2 save

# 查看运行状态
pm2 status

# 查看日志
pm2 logs music-app
```

### API使用示例

1. 获取歌词：
```
GET /musicAll/?lyric=1404206986
```

2. 获取歌单：
```
GET /musicAll/?playlistId=14189826720
```

3. 获取MP3文件（302重定向）：
```
GET /musicAll/?songId=1404206986&mp3Url=mp3
```

4. 直接访问静态文件：
```
GET /public/music/1404206986.mp3
GET /public/images/1404206986.jpg
```

## 扩展功能建议

1. **数据库集成**：使用MongoDB或MySQL替代文件存储
2. **用户认证**：添加JWT认证保护API端点
3. **文件上传**：实现音乐和图片上传功能
4. **音频流媒体**：支持音频流式传输而非完整文件下载
5. **缓存机制**：使用Redis缓存热门请求
6. **搜索功能**：实现歌曲、歌手和专辑搜索

这个项目提供了音乐服务的基础功能，您可以根据需要进一步扩展和完善。希望这个设计对您有所帮助！
