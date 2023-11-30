import express from 'express'
import authRoute from './routes/auth'


const app=express();
app.use(express.json());

app.use('/auth', authRoute)

app.get('/', (req,res) => {
    res.send('Root Page')
})

const port=process.env.PORT;
app.listen(port || 3000, ()=> {
    console.log(`Server listening on port ${port}`)
})