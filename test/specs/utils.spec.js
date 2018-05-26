/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { BROKEN, FAILED, getTestStatus } from '../../lib/utils'

describe('utils functions', () => {
    describe('getTestStatus', () => {
        it('return  status for jasmine', () => {
            expect(getTestStatus({}, {framework: 'jasmine'})).to.equal(FAILED)
        })

        it('failed for AssertionError', () => {
            const config = {framework: 'mocha'}
            const test = {err: {name: 'AssertionError'}}
            expect(getTestStatus(test, config)).to.equal(FAILED)
        })

        it('failed for AssertionError stacktrace', () => {
            const config = {framework: 'mocha'}
            const test = {err: {stack: 'AssertionError'}}
            expect(getTestStatus(test, config)).to.equal(FAILED)
        })

        it('broken for not AssertionError', () => {
            const config = {framework: 'mocha'}
            const test = {err: {name: 'MyError'}}
            expect(getTestStatus(test, config)).to.equal(BROKEN)
        })

        it('failed status for not AssertionError stacktrace', () => {
            const config = {framework: 'mocha'}
            const test = {err: {stack: 'MyError stack trace'}}
            expect(getTestStatus(test, config)).to.equal(BROKEN)
        })
    })
})
