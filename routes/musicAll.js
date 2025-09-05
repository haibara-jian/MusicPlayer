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
