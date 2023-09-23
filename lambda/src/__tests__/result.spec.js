// useless tests
import { Err, Ok } from '../result.mjs'

const EXPECTED = 'some-value'

describe('Ok', () => {
	it('should return success: true; data', () => {
		expect(Ok(EXPECTED)).toStrictEqual({success: true, data: EXPECTED})
	})
})


describe('Err', () => {
	it('should return success: true; data', () => {
		expect(Err(EXPECTED)).toStrictEqual({success: false, err: EXPECTED})
	})
})
