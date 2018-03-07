import { expect } from 'chai'
import { defineSupportCode } from 'cucumber'

defineSupportCode(({ Given, When, Then }) => {
    Given('I visit {stringInDoubleQuotes}', (url) => browser.url(url))

    When('I click the clickable region', () => browser.click('#clickable'))

    Then('I should get the result: {int}', (num) => {
        browser.getValue('#result').then((value) => {
            expect(value).to.be.equal(num.toString())
        })
    })

    Then('I should run failing step', () => {
        expect(true).to.be.equal(false)
    })
})
