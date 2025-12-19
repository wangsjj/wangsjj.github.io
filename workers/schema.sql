-- 个人信息表
-- 用于存储生成的虚拟个人信息数据

CREATE TABLE IF NOT EXISTS persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,                    -- 姓名
    id_card_no TEXT NOT NULL,              -- 身份证号
    mobile TEXT NOT NULL,                  -- 手机号
    bank_card_no TEXT NOT NULL,            -- 银行卡号
    plate_no TEXT NOT NULL,                -- 车牌号
    vin TEXT NOT NULL,                     -- 车架号
    address TEXT NOT NULL,                 -- 地址
    note TEXT DEFAULT '',                  -- 备注
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- 更新时间
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_persons_created_at ON persons(created_at);
CREATE INDEX IF NOT EXISTS idx_persons_name ON persons(name);
