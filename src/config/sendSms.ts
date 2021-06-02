import { Twilio } from 'twilio'

const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`
const from = `${process.env.TWILIO_PHONE_NUMBER}`

const client = new Twilio(accountSid, authToken)

export const sendSms = (to: string, body: string, text: string) => {
  try {
    client.messages
      .create({
        body: `Blog App ${text} - ${body}`,
        from,
        to,
      })
      .then((message) => console.log(`✨ Message sent successfully with id: ${message.sid}`))
  } catch (error) {
    console.error(error)
  }
}
