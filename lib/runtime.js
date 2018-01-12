import process from 'process'

export function feature (feature) {
    tellReporter('allure:feature', { feature })
}

function tellReporter (event, msg = {}) {
    process.send({ event, ...msg })
}

export default {
    feature
}
