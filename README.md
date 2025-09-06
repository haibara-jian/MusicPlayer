



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


