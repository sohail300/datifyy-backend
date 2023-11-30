import express from 'express'
import authRoute from './routes/auth'
import apiRoute from './routes/api'

const app=express();
app.use(express.json());

app.use('/auth', authRoute);
app.use('/api', apiRoute);

app.get('/', (req,res) => {
    res.send('Root Page')
})

app.listen(5000, ()=> {
    console.log('Server listening at port 5000')
})