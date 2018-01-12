import process from 'process'

export function feature (feature) {
    console.log('features', feature)
    tellReporter('allure:feature', { feature })
}

function tellReporter (event, msg = {}) {
    console.log('msg', msg)
    process.send({ event, ...msg })
}

export default {
    feature
}
