const generate = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generate
}