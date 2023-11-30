import express from 'express'
import authRoute from './routes/auth'


const app=express();
app.use(express.json());

app.use('/auth', authRoute)

app.get('/', (req,res) => {
    res.send('Root Page')
})

app.listen(5000, ()=> {
    console.log('Server listening at port 5000')
})