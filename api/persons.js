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

// 创建连接
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// 设置 CORS 头
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let connection;
  try {
    connection = await getConnection();

    // GET - 获取所有数据
    if (req.method === 'GET') {
      const [rows] = await connection.execute(
        'SELECT * FROM person_info ORDER BY created_at DESC'
      );
      return res.status(200).json({ success: true, data: rows });
    }

    // POST - 批量新增数据
    if (req.method === 'POST') {
      const { persons } = req.body;
      
      if (!persons || !Array.isArray(persons) || persons.length === 0) {
        return res.status(400).json({ success: false, message: '无效的数据' });
      }

      for (const p of persons) {
        await connection.execute(
          `INSERT INTO person_info (name, id_card_no, mobile, bank_card_no, plate_no, vin, address, note) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.idCardNo, p.mobile, p.bankCardNo, p.plateNo, p.vin, p.address, p.note || '']
        );
      }
      
      return res.status(200).json({ 
        success: true, 
        message: `成功保存 ${persons.length} 条数据`
      });
    }

    // DELETE - 清空所有数据
    if (req.method === 'DELETE') {
      await connection.execute('DELETE FROM person_info');
      return res.status(200).json({ success: true, message: '所有数据已清空' });
    }

    return res.status(405).json({ success: false, message: '方法不允许' });

  } catch (error) {
    console.error('数据库操作失败:', error);
    return res.status(500).json({ success: false, message: '操作失败', error: error.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
