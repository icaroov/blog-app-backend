import mongoose from 'mongoose'

const URI = `${process.env.MONGODB_URL}`

const options: mongoose.ConnectOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.connect(URI, options, (error) => {
  if (error) throw new Error(error.message)

  console.log('✨ MongoDB connected.')
})
