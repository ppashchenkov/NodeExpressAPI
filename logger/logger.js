class Log {
    static info = text => {
        console.info(getData(), "[INFO]", text)
    }
    static warning= text => {
        console.info(getData(), "[WARNING]", text)
    }
    static error= text => {
        console.info(getData(), "[ERROR]", text)
    }
    static fatal= text => {
        console.info(getData(), "[FATAL]", text)
    }
    static server= text => {
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
// const log = new Log()
export default Log

