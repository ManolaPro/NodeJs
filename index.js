const express = require('express')
const path = require('path')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const orderRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res,next) => {
    try {
        const user = await User.findById('5f857725685d9c1b9923c348')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', orderRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb+srv://*******:*********@cluster0.wsia0.azure.mongodb.net/Courses?retryWrites=true&w=majority`
        await mongoose.connect(url, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'alex@gmail.com',
                name: 'Alex',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
