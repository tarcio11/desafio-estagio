export default {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/desafio-estagio',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'e2a14452f81346848c'
}
