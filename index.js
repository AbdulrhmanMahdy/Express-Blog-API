const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 4000
const userRoutes = require('./routes/user.routes');
const todosRoutes = require('./routes/todo.routes')
const postsRoutes = require('./routes/post.routes')
const commentsRoutes = require('./routes/comment.routes')
const prisma = require('./lib/prisma')


// use npm middleware
app.use(morgan('combined'))
// core middleware
app.use(express.json())

app.use('/users', userRoutes)
app.use('/todos', todosRoutes)
app.use('/posts', postsRoutes)
app.use('/comments', commentsRoutes)




// global error handler
app.use((err, req, res, next) => {
	res.status(err.statusCode || 500).send({
		statusCode: err.statusCode || 500,
		message: err.message || 'something went wrong',
		errors: []
	})
})
async function main() {
	try {
		await prisma.$connect();
		console.log('successfully connected to database')
		app.listen(port, () => {
			console.log(`Example app listening on port ${port}`)
		})
	} catch (err) {
		console.log('error happened to connect to database')
	}
}

main()