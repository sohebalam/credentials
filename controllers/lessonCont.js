// import AWS from "aws-sdk"
import { nanoid } from "nanoid"
import Course from "../models/courseModel"
import slugify from "slugify"
import { readFileSync } from "fs"
// import Completed from "../models/completeModel"
import formidable from "formidable"
import fs from "fs"

//update

export const getFiles = async (req, res) => {
  console.log(req.query)
  const { slug } = req.query

  return

  // console.log(ytList)
  res.send(ytList[0])
}

export const fileSave = async (req, res) => {
  const slug = req.query.slug

  // console.log(req.method)
  const course = await Course.findOne({ slug: slug })

  console.log(course)

  // if (!ytList) {
  //   const newList = await new YTList({
  //     slug: slug,
  //   }).save()
  // }

  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    const slug = req.query.slug
    await saveFile(files.file, fields, slug, course)
    // return res.status(201).json({ message: "uploaded file" })
  })
  return
}

const saveFile = async (file, fields, slug, course) => {
  const { title, description } = fields
  // console.log("sdssda", slug, course)
  console.log(file.filepath, title, description)
  // (`${process.cwd()}\\public\\public\\${req.body.item.name}`
  const data = fs.readFileSync(file.filepath)
  fs.writeFileSync(
    `${process.cwd()}\\public\\files\\${file.originalFilename}`,
    data
  )
  await fs.unlinkSync(file.filepath)

  try {
    // console.log(file.path, file.type, title, description)

    const files = {
      media: "file",
      title,
      name: file.originalFilename,
      description,
      file_path: `${process.cwd()}\\public\\files\\${file.originalFilename}`,
      file_mimetype: file.mimetype,
    }

    console.log("files", files)

    var newList = await Course.findByIdAndUpdate(
      { _id: course?._id },

      { $push: { lessons: files } }
    )

    // console.log("dssds", newList)

    // res.send(newList)
  } catch (error) {
    console.log(error)
    // post(req, res)
    // res.status(400).send("Error while uploading file. Try again later.")
  }

  return
}

export const lessonOrder = async (req, res) => {
  const { slug } = req.query

  const nonObjlessons = Object.values(req.body)

  const lessons = nonObjlessons.map((item) => ({
    title: item.title || "",
    description: item.description || "",
    media: "lesson",
    playlistId: item.playlistId || "",
    videoId: item.videoId || "",
    thumbnailUrl: item.thumbnailUrl || "",
    channelTitle: item.channelTitle || "",
    file_path: item.file_path || "",
    file_mimetype: item.file_mimetype || "",
    name: item.name || "",
  }))
  // console.log(lessons)

  const updated = await YTList.findOneAndUpdate(
    { slug },
    {
      lessons: lessons,
    },
    {
      new: true,
    }
  ).exec()

  res.json(updated)
}

export const deleteFile = async (req, res) => {
  const { slug } = req.query
  // console.log(req.method, req.body, slug)

  console.log(`${process.cwd()}\\public\\public\\${req.body.item.name}`)

  await fs.unlinkSync(req.body.item.file_path)

  const updated = await YTList.findOneAndUpdate(
    { slug: slug },
    {
      $pull: { lessons: { _id: req.body.item._id } },

      new: true,
    }
  ).exec()

  const updatedfile = await YTList.findOneAndUpdate(
    { slug: slug },
    {
      $pull: { files: { name: req.body.item.name } },

      new: true,
    }
  ).exec()

  // console.log(updated, updatedfile)
}

export const fileDownload = async (req, res) => {
  console.log(req.query.id)
  console.log("here")

  const { slug, id } = req.query

  const [{ lessons }] = await YTList.find({ slug })
  // const ytList = await YTList.find({ slug }, { lessons })
  // const ytList = await YTList.find({ slug }, [lessons])

  var newArray = lessons.filter((lesson) => {
    if (lesson._id.toString() === id) {
      return lesson
    }
  })
  const [lesson] = newArray

  try {
    // const filePath = `${process.cwd()}\\public\\${file.name}`

    const fileBuffer = fs.createReadStream(lesson.file_path)

    await new Promise(function (resolve) {
      res.setHeader("Content-Type", lesson.file_mimetype)
      fileBuffer.pipe(res)
      fileBuffer.on("end", resolve)
      fileBuffer.on("error", function (err) {
        if (err.code === "ENOENT") {
          res.status(400).json({
            error: true,
            message: "Sorry we could not find the file you requested!",
          })
          res.end()
        } else {
          res
            .status(500)
            .json({ error: true, message: "Sorry, something went wrong!" })
          res.end()
        }
      })
    })
  } catch (error) {
    res.status(400).send("Error while downloading file. Try again later.")
  }
}

// export const youtube = async (req, res) => {
//   // console.log("xfcvfdzxhere")
//   const { slug } = req.query

//   // const { playlistId } = req.body

//   console.log("youtube", slug)

//   try {
//     const YOUTUBE_PLAYLIST_ITEMS_API =
//       "https://www.googleapis.com/youtube/v3/playlistItems"

//     // const course = await Course.findOne({ slug: slug })
//     //   .populate("instructor", "_id name")
//     //   .exec()

//     const playlistId = req.body.playlistId
//     console.log(playlistId)

//     return

//     const response = await fetch(
//       `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`
//     )

//     // console.log("coursezds", course)

//     const data = await response?.json()

//     const videos = data.items?.map((item) => ({
//       playlistId: item.snippet.playlistId,
//       videoId: item.snippet.resourceId.videoId,
//       thumbnailUrl: item.snippet.thumbnails.medium.url,
//       title: item.snippet.title,
//       description: item.snippet.description,
//       channelTitle: item.snippet.channelTitle,
//     }))

//     console.log("newyoutube", slug)

//     const newList = await Course.findByIdAndUpdate(
//       { _id: course?._id },

//       { $addToSet: { lessons: videos } }
//     )
//     // console.log("newlist", newList)
//     res.send(newList)
//   } catch (error) {
//     console.log(error)
//   }
// }
