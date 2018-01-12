import process from 'process'

export function feature (featureName) {
    tellReporter('allure:feature', { featureName })
}

function tellReporter (event, msg = {}) {
    process.send({ event, ...msg })
}

export default {
    feature
}
