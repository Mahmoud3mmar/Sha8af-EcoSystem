
import express from 'express'
import { AppError } from './src/utils/error.handler.js'
import AuthRouter from './src/modules/Auth/routes/auth.routes.js'
import RoomRouter from './src/modules/Room/Routes/Room.Route.js'
import BranchRouter from './src/modules/Branch/Routes/Branch.Routes.js'
import BookingRouter from './src/modules/Booking/Routes/Booking.Routes.js'
import CouponRouter from './src/modules/Coupon/Routes/Coupon.Routes.js'

export const bootstrap = (app) => {
	app.use(express.json())

	app.use('/auth', AuthRouter)
	app.use('/branch', BranchRouter)

	app.use('/room', RoomRouter)
	app.use('/booking', BookingRouter)
	app.use('/coupon', CouponRouter)


	app.all('*', (req, res) => {
		throw new AppError("This route doesn't exist", 404)
	})

	app.use((error, req, res, next) => {
		const { message, status, stack } = error
		res.status(status || 500).json({ message, stack })
	})
}