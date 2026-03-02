/**
 * 初始化 librarydb 表结构并写入 mock 数据。
 * 使用前请确保：1）MySQL 已启动 2）已创建数据库 librarydb 并授权 librarydb_user
 * 运行：node db/seed.js（在 backend 目录下）
 */
import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'librarydb_user',
  password: process.env.DB_PASSWORD || '111111',
  database: process.env.DB_DATABASE || 'librarydb',
  multipleStatements: true
}

async function run() {
  const conn = await mysql.createConnection(config)
  try {
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    await conn.query(schema)
    console.log('Schema executed.')

    await conn.query(
      `INSERT INTO readers (id, username, password, name, role, email) VALUES
      (1, 'admin', 'admin123', 'Admin User', 'admin', 'admin@library.com'),
      (2, 'user1', 'user123', 'John Doe', 'user', 'john@example.com'),
      (3, 'doctor@126.com', 'password', 'Jane Smith', 'user', 'jane@example.com'),
      (4, 'wanghan46', 'aaaaaa', 'Admin User Wang', 'admin', 'admin@library.com')`
    )
    console.log('Readers seeded.')

    const books = [
      [1, '杀死一只知更鸟', '哈珀·李', '978-0061120084', 1960, '小说', '这部令人难忘的小说描绘了美国南方小镇的童年生活，以及一场撼动整个社区的良知危机。通过孩子的视角深刻揭露了种族偏见与社会不公，展现了人性中的勇气与善良。', 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=600', 3],
      [2, '一九八四', '乔治·奥威尔', '978-0451524935', 1949, '小说', '这部反乌托邦经典设定在极权国家大洋国，描绘了永续战争、全方位监控与思想控制的恐怖世界。', 'https://images.pexels.com/photos/3826686/pexels-photo-3826686.jpeg?auto=compress&cs=tinysrgb&w=600', 2],
      [3, '了不起的盖茨比', 'F·斯科特·菲茨杰拉德', '978-0743273565', 1925, '名著', '这部关于浮华与幻灭的杰作精准捕捉了爵士时代美国社会的横截面。', 'https://images.pexels.com/photos/2465877/pexels-photo-2465877.jpeg?auto=compress&cs=tinysrgb&w=600', 1],
      [4, '傲慢与偏见', '简·奥斯汀', '978-0141439518', 1813, '名著', '这部社会风俗喜剧通过伊丽莎白·班纳特的成长历程，犀利剖析了英国乡绅阶层的婚姻观与金钱观。', 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=600', 2],
      [5, '霍比特人', 'J·R·R·托尔金', '978-0547928227', 1937, '奇幻', '这部中土世界冒险传奇讲述了平凡霍比特人比尔博·巴金斯的史诗征程。', 'https://images.pexels.com/photos/2386687/pexels-photo-2386687.jpeg?auto=compress&cs=tinysrgb&w=600', 3],
      [6, '麦田里的守望者', 'J·D·塞林格', '978-0316769488', 1951, '小说', '这部青春叛逆经典以霍尔顿·考尔菲德的口吻，赤裸展现青少年面对虚伪成人世界的疏离与挣扎。', 'https://images.pexels.com/photos/2127790/pexels-photo-2127790.jpeg?auto=compress&cs=tinysrgb&w=600', 2],
      [7, '魔戒', 'J·R·R·托尔金', '978-0618640157', 1954, '奇幻', '这部史诗级奇幻巨著构建了宏大的中土世界，围绕至尊魔戒展开正邪终极对决。', 'https://images.pexels.com/photos/1738805/pexels-photo-1738805.jpeg?auto=compress&cs=tinysrgb&w=600', 4],
      [8, '哈利·波特与魔法石', 'J·K·罗琳', '978-0747532699', 1997, '奇幻', '这部现代奇幻开篇之作讲述孤儿哈利·波特在十一岁生日踏入霍格沃茨魔法学校的传奇。', 'https://images.pexels.com/photos/3388671/pexels-photo-3388671.jpeg?auto=compress&cs=tinysrgb&w=600', 5],
      [9, '三体', '刘慈欣', '978-7536692930', 2008, '科幻', '地球文明与三体文明跨越四百年的宇宙史诗，黑暗森林法则震撼揭示宇宙社会学真相。', 'https://images.pexels.com/photos/414144/pexels-photo-414144.jpeg?auto=compress&cs=tinysrgb&w=600', 4],
      [10, '活着', '余华', '978-7506365437', 1993, '文学', '农民福贵历经内战、文革等时代巨变，亲人相继离世的苦难史诗。', 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=600', 3],
      [11, '平凡的世界', '路遥', '978-7020049295', 1986, '名著', '陕北农村孙少安、孙少平兄弟在改革开放浪潮中的奋斗史诗。', 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=600', 5],
      [12, '白夜行', '东野圭吾', '978-7544258609', 1999, '悬疑', '桐原亮司与唐泽雪穗在命案阴影下的共生关系，十九年连环罪案编织成绝望爱情罗网。', 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=600', 2],
      [13, '围城', '钱钟书', '978-7020024759', 1947, '名著', '留洋博士方鸿渐在爱情与事业双重围城中的困顿人生。', 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=600', 1],
      [14, '天龙八部', '金庸', '978-7805798233', 1963, '武侠', '宋辽夏大理多国纷争背景下的江湖史诗，乔峰、虚竹、段誉三主角的命运交响。', 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=600', 3],
      [15, '撒哈拉的故事', '三毛', '978-7530216782', 1976, '文学', '三毛与荷西在撒哈拉的流浪传奇，用炽热文字记录沙漠婚礼、悬壶济世的异域人生。', 'https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg?auto=compress&cs=tinysrgb&w=600', 2],
      [16, '明朝那些事儿', '当年明月', '978-7801656087', 2006, '历史', '以网络语言重述三百年明史，朱元璋到崇祯九帝的鲜活群像。', 'https://images.pexels.com/photos/459791/pexels-photo-459791.jpeg?auto=compress&cs=tinysrgb&w=600', 4],
      [17, '台北人', '白先勇', '978-9573305540', 1971, '小说', '十四篇离散者的台北浮世绘，从将军遗孀到酒家女，承载民国记忆的流亡者群像。', 'https://images.pexels.com/photos/3631711/pexels-photo-3631711.jpeg?auto=compress&cs=tinysrgb&w=600', 3],
      [18, '孽子', '白先勇', '978-9573308961', 1983, '文学', '台北新公园“黑暗王国”中青春鸟们的爱欲挣扎，被家庭放逐的同性恋少年寻找救赎。', 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=600', 2]
    ]
    for (const row of books) {
      await conn.query(
        'INSERT INTO books (id, title, author, isbn, publish_year, category, description, cover_image, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        row
      )
    }
    console.log('Books seeded.')

    await conn.query(
      `INSERT INTO borrowrecords (id, reader_id, book_id, borrow_date, return_date, status) VALUES
      (1, 2, 1, '2023-10-15', NULL, 'active'),
      (2, 2, 3, '2023-10-20', NULL, 'active'),
      (3, 3, 5, '2023-10-10', NULL, 'overdue'),
      (4, 2, 4, '2023-09-01', '2023-09-20', 'returned')`
    )
    console.log('Borrowrecords seeded.')
  } finally {
    await conn.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
