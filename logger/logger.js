class Log {
    info = text => {
        console.info(getData(), "[INFO]", text)
    }
    warning= text => {
        console.info(getData(), "[WARNING]", text)
    }
    error= text => {
        console.info(getData(), "[ERROR]", text)
    }
    fatal= text => {
        console.info(getData(), "[FATAL]", text)
    }
    server= text => {
        console.info(getData(), "[SERVER]", text)
    }
    // runner
    // test
}

function getData() {
    const date = new Date()
    return  date.toLocaleString('en-US',
        { timeZoneName: 'short' })
}
const log = new Log()
export default log