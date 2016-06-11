/**
 * validate incoming data to meet minimum requirements
 *
 * @param {Object} data
 */
export default function validateData (data) {
    if (!data) {
        throw new Error('no data provided')
    }

    if (!data.specs || !data.specs.length) {
        throw new Error('invalid data provided')
    }
}
