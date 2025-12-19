/**
 * Cloudflare Workers API - 个人信息管理
 * 提供 CRUD 操作接口，使用 D1 数据库存储
 */

// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// JSON 响应辅助函数
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// 错误响应
function errorResponse(message, status = 500) {
  return jsonResponse({ success: false, error: message }, status);
}

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 路由处理
      // GET /api/persons - 获取所有记录
      if (path === '/api/persons' && request.method === 'GET') {
        return await getPersons(env.DB);
      }

      // POST /api/persons - 新增记录
      if (path === '/api/persons' && request.method === 'POST') {
        const body = await request.json();
        return await createPerson(env.DB, body);
      }

      // POST /api/persons/batch - 批量新增记录
      if (path === '/api/persons/batch' && request.method === 'POST') {
        const body = await request.json();
        return await createPersonsBatch(env.DB, body);
      }

      // PUT /api/persons/:id - 更新记录（主要用于更新备注）
      if (path.match(/^\/api\/persons\/\d+$/) && request.method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json();
        return await updatePerson(env.DB, id, body);
      }

      // DELETE /api/persons/:id - 删除单条记录
      if (path.match(/^\/api\/persons\/\d+$/) && request.method === 'DELETE') {
        const id = path.split('/').pop();
        return await deletePerson(env.DB, id);
      }

      // DELETE /api/persons - 清空所有记录
      if (path === '/api/persons' && request.method === 'DELETE') {
        return await deleteAllPersons(env.DB);
      }

      // 404 - 未找到路由
      return errorResponse('Not Found', 404);

    } catch (error) {
      console.error('API Error:', error);
      return errorResponse(error.message || 'Internal Server Error', 500);
    }
  },
};

// 获取所有记录
async function getPersons(db) {
  const result = await db.prepare(
    'SELECT * FROM persons ORDER BY created_at DESC'
  ).all();
  
  return jsonResponse({
    success: true,
    data: result.results || [],
  });
}

// 新增单条记录
async function createPerson(db, data) {
  const { name, idCardNo, mobile, bankCardNo, plateNo, vin, address, note = '' } = data;
  
  if (!name || !idCardNo || !mobile || !bankCardNo || !plateNo || !vin || !address) {
    return errorResponse('Missing required fields', 400);
  }

  const result = await db.prepare(
    `INSERT INTO persons (name, id_card_no, mobile, bank_card_no, plate_no, vin, address, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(name, idCardNo, mobile, bankCardNo, plateNo, vin, address, note).run();

  return jsonResponse({
    success: true,
    message: 'Person created successfully',
    id: result.meta.last_row_id,
  }, 201);
}

// 批量新增记录
async function createPersonsBatch(db, data) {
  if (!Array.isArray(data) || data.length === 0) {
    return errorResponse('Invalid data: expected non-empty array', 400);
  }

  const stmt = db.prepare(
    `INSERT INTO persons (name, id_card_no, mobile, bank_card_no, plate_no, vin, address, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const batch = data.map(person => {
    const { name, idCardNo, mobile, bankCardNo, plateNo, vin, address, note = '' } = person;
    return stmt.bind(name, idCardNo, mobile, bankCardNo, plateNo, vin, address, note);
  });

  await db.batch(batch);

  return jsonResponse({
    success: true,
    message: `${data.length} persons created successfully`,
  }, 201);
}

// 更新记录（主要用于更新备注）
async function updatePerson(db, id, data) {
  const { note } = data;
  
  if (note === undefined) {
    return errorResponse('Missing note field', 400);
  }

  const result = await db.prepare(
    `UPDATE persons SET note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(note, id).run();

  if (result.meta.changes === 0) {
    return errorResponse('Person not found', 404);
  }

  return jsonResponse({
    success: true,
    message: 'Person updated successfully',
  });
}

// 删除单条记录
async function deletePerson(db, id) {
  const result = await db.prepare(
    'DELETE FROM persons WHERE id = ?'
  ).bind(id).run();

  if (result.meta.changes === 0) {
    return errorResponse('Person not found', 404);
  }

  return jsonResponse({
    success: true,
    message: 'Person deleted successfully',
  });
}

// 清空所有记录
async function deleteAllPersons(db) {
  await db.prepare('DELETE FROM persons').run();
  
  return jsonResponse({
    success: true,
    message: 'All persons deleted successfully',
  });
}
