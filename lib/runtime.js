import process from 'process'

export function feature (featureName) {
    tellReporter('allure:feature', { featureName })
}

export function addEnvironment (name, value) {
    tellReporter('allure:addEnvironment', { name, value })
}

function tellReporter (event, msg = {}) {
    process.send({ event, ...msg })
}

export default {
    feature,
    addEnvironment
}
