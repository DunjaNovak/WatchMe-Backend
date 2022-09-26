import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Pavle Maric',
    email: 'pavle@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Hana Majic',
    email: 'hana@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users