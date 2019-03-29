const {
    Wechaty
} = require('wechaty')
const schedule = require('./schedule')
const axios = require('axios')
const moment = require('moment')

const bot = new Wechaty({name:"WecahtBot"})
bot.on('scan', (url, code) => {
    if (!/201|200/.test(String(code))) {
        let loginUrl = url.replace(/\/qrcode\//, '/l/')
        require('qrcode-terminal').generate(loginUrl)
    }
    console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})
bot.on('login', user => {
    schedule.setSchedule("0 0 8 * * ? ", () => {
        main()
    })
})
bot.on('message', message => {
    const room = message.room()
    const contact = message.from()
    if (message.self()) {
        return
    }
    if (room) {
        console.log(room)
    } else {
        message.say('辣鸡辣鸡')
    }
})
bot.start()


async function main() {
    let logMsg
    let time = new Date()
    let y = time.getFullYear()
    let m = time.getMonth()
    let d = time.getDate()
    let a = moment([2019, 2, 22])
    let b = moment([y, m, d])

    let contact = await bot.Contact.find({
        name: '{}'
    })
    axios.get('http://v.juhe.cn/weather/index?key=你的key&cityname=1840').then(v => {
        const {
            result: {
                today: {
                    temperature,
                    weather,
                    wind,
                    week,
                    city,
                    date_y,
                    dressing_index,

                },
                sk: {
                    humidity
                }
            }
        } = v.data
        axios.get('http://open.iciba.com/dsapi/').then(vv => {
            const {
                content,
                note
            } = vv.data
            logMsg = `今天是${date_y} ${week}<br>我们在一起的第${b.diff(a,'days')+1}天(*^▽^*)<br>天气情况如下:<br>${city}<br>${weather}<br>温度${temperature}<br>湿度${humidity} ${wind} ${dressing_index}<br><br>${content}<br><br>${note}`
            contact.say(logMsg)
        })
    })
}
