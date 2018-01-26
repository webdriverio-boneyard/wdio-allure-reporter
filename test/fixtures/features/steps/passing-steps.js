import { expect } from 'chai'
import { defineSupportCode } from 'cucumber'

defineSupportCode(({ Given, When, Then }) => {
    Given('I visit {stringInDoubleQuotes}', (url) => browser.url(url))

    When('I click the clickable region', () => browser.click('#clickable'))

    Then('I should get the result: {int}', (num) => {
        const result = browser.getValue('#result')
        expect(result).to.be.equal(num.toString())
    })
})
