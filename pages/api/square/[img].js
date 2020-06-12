import { drawCanvas } from "../../../components/drawCanvas"
import { stringIsValid, strToGameState } from '../../../components/gameStatePack'
import fonttrick from 'fonttrick'


export default (req, res) => {      // { query: { img } }
  // some constants
  const fallbackString = "1xThe~2ysent~3zlink~4yis~5wnot~6xa~7xvalid~8zsentence~9f~~"
  // const fbs64 = Buffer.from(fallbackString,'utf8').toString('base64')

  // some variables
  let imageWidth = 600     // standard for fb ogimage
  let imageHeight = 600     // standard for fb ogimage

  // we need to remove the initial "/api/square/" before we can use the req string
  const reqString64png = req.url.split('/')[3]
  //console.log(reqString64png)
  const reqString64 = reqString64png.substring(0, reqString64png.length - 4)
  // and also it's base64 encoded, so convert to utf8
  const reqString = Buffer.from(reqString64, 'base64').toString('utf8')

  //const pathToRoboto = path.join(process.cwd(), 'node_modules/fonttrick/Roboto-Regular.ttf')
  let output = null

  if (stringIsValid({ sentenceString: reqString })) {
    let data = JSON.parse(strToGameState({ canvasURLstring: reqString }))
    output = drawCanvas({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
      fontPath: fonttrick()
    })
  } else {
    let data = JSON.parse(strToGameState({ canvasURLstring: fallbackString }))
    output = drawCanvas({
      sentence: data.sentence,
      cards: data.cards,
      width: imageWidth,
      height: imageHeight,
      fontPath: fonttrick()
    })
  }

  const buffy = Buffer.from(output.split(',')[1], 'base64')
  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  res.end(buffy)
}

