module.exports ={
  'name': 'default',
  'type': 'postgres',
  'host': 'localhost',
  'url': process.env.DATABASE_URL,
  'entities': ['dist/entities/*.js'],
  'migrations': ['dist/migrations/*.js'],
  'logging': true
}