
class Person {
  constructor(name, idCard, mobile, bankCardNo, plateNo, vin) {
    this.name = name;
    this.idCardNo = idCard;
    this.mobile = mobile;
    this.bankCardNo = bankCardNo;
    this.plateNo = plateNo;
    this.vin = vin;
  }
}

function randomPerson() {
  const table = document.getElementById("table");
  const persons = getPersonList(1);
  let content = persons.map(person => `
    <tr>
      <td>${person.name}</td>
      <td>${person.idCardNo}</td>
      <td>${person.mobile}</td>
      <td>${person.bankCardNo}</td>
      <td>${person.plateNo}</td>
      <td>${person.idCardNo}</td>
      <td><input></input></td>
    </tr>
  `).join('');
  table.insertAdjacentHTML('beforeend', content);
}

function getPersonList(num) {
  return Array.from({ length: num }, () => new Person(randomName(), randomIdCard(), randomMobile(), randomBankCard(), randomPlate(), null));
}

const provinces = ["京A", "京B", "津A", "冀A", "晋A", "蒙A", "辽A", "吉A", "黑A", "沪A", "沪B", "沪C", "沪D",
  "苏A", "苏B", "浙A", "皖A", "闽A", "赣A", "鲁A", "豫A", "豫B", "豫V", "鄂A", "湘A",
  "粤A", "桂A", "琼A", "渝A", "川A", "贵A", "云A", "藏A", "陕A",
  "甘A", "青A", "宁A", "新A"];

function randomPlate() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const idvalue = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * 36)]).join('');
  return provinces[Math.floor(Math.random() * provinces.length)] + idvalue;
}

const areaCode = Array.from({ length: 659001 }, (_, i) => 110000 + i);

function randomIdCard() {
  const randomArea = areaCode[Math.floor(Math.random() * areaCode.length)];
  const randomDate = new Date(+new Date(1960, 0, 1) + Math.random() * (new Date(2000, 0, 1) - new Date(1960, 0, 1)));
  const randomCode = Math.floor(Math.random() * 900) + 100;
  const idCardNo = `${randomArea}${randomDate.toISOString().slice(0, 10).replace(/-/g, '')}${randomCode}`;
  const sum = Array.from(idCardNo.slice(0, 17)).reduce((acc, num, idx) => acc + (num * [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2][idx]), 0);
  const verifyCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'][sum % 11];
  return idCardNo + verifyCode;
}

const mobilePrefix = ["133", "153", "177", "180", "181", "189", "134", "135", "136", "137", "138", "139", "150", "151", "152", "157", "158", "159",
  "178", "182", "183", "184", "187", "188", "130", "131", "132", "155", "156", "176", "185", "186", "145", "147", "170"];

function randomMobile() {
  const mobileHead = mobilePrefix[Math.floor(Math.random() * mobilePrefix.length)];
  const tail = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  return mobileHead + tail;
}

function randomBankCard() {
  const prev = 622126 + Math.floor(Math.random() * 800);
  const bardNo = `${prev}${Math.floor(Math.random() * 900000000) + 100000000}`;
  const checkCode = getLuhnCheckCode(bardNo);
  return bardNo + checkCode;
}

function getLuhnCheckCode(bankcard) {
  const digits = bankcard.split('').reverse();
  const sum = digits.reduce((acc, digit, idx) => {
    if (idx % 2 === 0) {
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    } else {
      return acc + +digit;
    }
  }, 0);
  return (10 - sum % 10) % 10;
}

const familyNames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许',
  '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章',
  '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳',
  '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常',
  '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹',
  '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞',
  '熊', '纪', '舒', '屈', '项', '祝', '董', '粱', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄',
  '江', '童', '颜', '郭', '梅', '盛', '林', '刁', '钟', '徐', '邱', '骆', '高', '夏', '蔡', '田', '樊', '胡', '凌', '霍',
  '虞', '万', '支', '柯', '卢', '莫', '经', '房', '裘', '缪', '干', '解', '应', '宗', '丁', '邓',
  '郁', '单', '杭', '洪', '包', '左', '石', '崔', '吉', '钮', '龚', '程', '嵇', '邢', '裴', '陆', '荣', '翁',
  '荀', '甄', '家', '封', '靳', '井', '段', '巫',
  '乌', '焦', '巴', '谷', '车', '侯', '班', '秋', '伊', '宫',
  '宁', '仇', '甘', '厉', '武', '符', '刘', '景', '詹', '龙', '叶',
  '郜', '黎', '薄', '白', '蒲', '邰', '赖', '卓', '蔺', '屠', '蒙',
  '池', '乔', '翟', '谭', '姬', '申',
  '冉', '雍', '桂', '牛', '燕', '农',
  '温', '庄', '晏', '柴', '瞿', '阎', '习', '艾', '鱼', '容', '向', '古', '易',
  '廖', '步', '都', '耿', '满', '匡', '文', '寇',
  '巩', '聂', '晁', '敖', '冷', '辛',
  '那', '简', '饶', '曾', '沙', '鞠', '关', '查',
  '游', '权', '楚', '岳', '言', '况', '商', '佘', '年', '佟',
  '司马', '上官', '欧阳', '夏侯', '诸葛', '闻人', '东方', '赫连', '皇甫', '尉迟', '公孙', '轩辕', '令狐',
  '钟离', '宇文', '长孙', '慕容', '司徒', '端木', '拓拔', '百里', '东郭', '呼延', '西门', '南宫'];

function randomName() {
  const familyName = pick(familyNames);
  const nameLength = Math.random() > 0.66 ? 1 : 2;
  const name = Array.from({ length: nameLength }, () => pick(names)).join('');
  return familyName + name;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
