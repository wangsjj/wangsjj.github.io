const mysql = require('mysql2/promise');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || '2wbv6Fj8JRXhNWj.root',
  password: process.env.DB_PASSWORD || 'AnSFjWoJiTm60bUA',
  database: process.env.DB_NAME || 'test',
  ssl: {
    rejectUnauthorized: true
  }
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let connection;
  try {
    connection = await getConnection();

    // PUT - 根据身份证号更新备注
    if (req.method === 'PUT') {
      const { idCardNo, note } = req.body;
      
      const [result] = await connection.execute(
        'UPDATE person_info SET note = ?, updated_at = CURRENT_TIMESTAMP WHERE id_card_no = ?',
        [note, idCardNo]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: '数据不存在' });
      }
      
      return res.status(200).json({ success: true, message: '备注已更新' });
    }

    return res.status(405).json({ success: false, message: '方法不允许' });

  } catch (error) {
    console.error('更新备注失败:', error);
    return res.status(500).json({ success: false, message: '更新失败', error: error.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
