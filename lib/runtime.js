import process from 'process'

export function feature (featureName) {
    tellReporter('allure:feature', { featureName })
}

export function addEnvironment (name, value) {
    tellReporter('allure:addEnvironment', { name, value })
}

export function createAttachment (name, content, type = 'text/plain') {
    tellReporter('allure:attachment', {name, content, type})
}

export function story (storyName) {
    tellReporter('allure:story', { storyName })
}

function tellReporter (event, msg = {}) {
    process.send({ event, ...msg })
}

export default {
    feature,
    addEnvironment,
    createAttachment,
    story
}
