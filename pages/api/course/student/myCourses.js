import nc from "next-connect"
import connectDB from "../../../../connectDB"
import formidable from "formidable"
// import { readCourse } from "../../../controllers/courseCont"

import onError from "../../../../middlewares/errors"

import { isAuthenticated, isInstructor } from "../../../../middlewares/auth"
import { myCourses } from "../../../../controllers/courseCont"

const router = nc({ onError })

connectDB()

// console.log(req.method)

router.use(isAuthenticated).get(myCourses)

export default router