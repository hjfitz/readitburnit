export const Ok = (data) => ({
				success: true,
				data,
})

export const Err = (err) => ({
				success: false,
				err,
})
