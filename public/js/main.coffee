#Each instance represents single olympics event
class OlympicEvent
  constructor: (@year, @color, @nodes) ->


#Each node represents a participant country
class Node
  constructor: (@name, @gold, @silver, @bronze, @gdp, @year, @circle, @radius) ->

  #Display Textual info 
  displayInfo: () ->

  #Move to given year/event
  moveToYear: (year) ->


#Utility that wraps the actual paperjs drawing calls
class DrawingUtility
  constructor: (@p) ->
    @info = new @p.PointText(new @p.Point(900, 100))

    countryStyle = new @p.CharacterStyle()
    countryStyle.fontSize = 16
    countryStyle.fillColor = 'white'
    @info.characterStyle = countryStyle

    medalsStyle = new @p.CharacterStyle()
    medalsStyle.fontSize = 10
    medalsStyle.fillColor = 'white'
    @info.content = ""

    @medals = new @p.PointText(new @p.Point(900, 120))
    @medals.characterStyle = medalsStyle
    @medals.content = ""

  explode: (node) ->
    @info.content = node.name
    @medals.content = "Gold: " + node.gold + " Silver: " + node.silver + " Bronze: " + node.bronze
    

  clearText: () ->
    @info.content = ''
    @medals.content = ''


  drawLine: (pointA, pointB, strokeWidth) ->
    line = new @p.Path.Line(pointA, pointB)
    line.strokeColor = 'white'
    line.strokeWidth = strokeWidth
    line.smooth()




  #X and Y axis
  drawAxes: () ->
    origin = new @p.Point(50, 650)
    top = new @p.Point(50, 50)

    this.drawLine(top, top.add( [0, 600] ), 1)
    this.drawLine(origin, origin.add( [800, 0] ), 1)

    raster = new @p.Raster('2008')
    raster.position = new @p.Point(100, 680)

    # center = new @p.Point(300, 300)
    # points = 6
    # radius1 = 20
    # radius2 = 40
    # path = new @p.Path.Star(center, points, radius1, radius2)
    # path.fillColor = 'yellow'

  drawTraces: (nodes) ->
    for n in nodes
      existingPosition = n.circle.position
      n.circle.position.x += 100
      n.circle.position.y -= (Math.random()*10)
      this.drawLine(existingPosition, n.circle.position, n.radius/2)

  drawCircles: (nodes, xPosition, color) ->
    maxPoint = new @p.Point(100, 600)
    for n in nodes
      size = (n.gold + n.silver + n.bronze)
      size = size/4 
      if size < 1
        size = 2
      else if size < 5
        size = size*2
      #point = maxPoint.multiply randomPoint
      point = new @p.Point((Math.random()*100) + xPosition, 0)
      #point = new @p.Point(150, 0)
      yPoint = 650 - (n.gdp/100)
      #Cut off highest gdp countries overflowing the boundary
      yPoint = 50 if yPoint < 50
      point.y = yPoint
      #point.y = Math.floor((Math.random()*600)+50)
      

      circle = new @p.Path.Circle(point, size)
      circle.fillColor = color
      n.circle = circle
      n.radius = size
      console.log("name: " + n.name + " size: " + n.gdp)



paperCoffee ->
  
  nodes = []
  olympicEvents = []
  u = new DrawingUtility(paper)
  u.drawAxes()

  hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    type: 'Path.Circle', 
    tolerance: 1
  }

  #Load the data
  $.ajax
    url: '/countries',
    type: 'GET',
    dataType: 'json',
    success: (data) ->
      for f in data
        nodes.push(new Node(f['name'], parseInt(f['gold']), parseInt(f['silver']), parseInt(f['bronze']), parseInt(f['gdp']), 2008, null, null))
      olympicEvents.push(new OlympicEvent(2008, 'yellow', nodes))
      olympicEvents.push(new OlympicEvent(2004, 'white', nodes))
      olympicEvents.push(new OlympicEvent(2000, 'orange', nodes))
      u.drawCircles(nodes, 100, 'yellow')
      u.drawCircles(nodes, 200, 'white')
      u.drawCircles(nodes, 300, 'orange')
      u.drawCircles(nodes, 400, 'green')
      u.drawCircles(nodes, 500, 'teal')
      u.drawCircles(nodes, 600, 'blue')
      u.drawCircles(nodes, 700, 'orange')
      paper.view.draw()

  tool = new @Tool
  #Register the handlers

  tool.onMouseDown = (event) ->
    console.log("Mouse is down dude")
    u.drawTraces(nodes)

  tool.onMouseMove = (event) ->
    console.log("Moved mouse")
    hitResult = paper.project.hitTest(event.point, hitOptions)
    #paper.project.activeLayer.selected = false
    if (hitResult && hitResult.item)
      console.log("Found a hit" + hitResult.item.position)
      hitPoint = hitResult.item.position
      #alert(hitPoint)
      for n in nodes
        if hitPoint.isClose(n.circle.position, n.radius)
          for y in nodes
            if y != n
              y.circle.opacity = 0.5
              #y.circle.visible = false
          u.explode(n)
        else
          console.log("Missed for: " + n.name)
    else
      console.log("Clearing text..")
      for y in nodes
        y.circle.opacity = 1
        #y.circle.visible = true
      u.clearText()




  tool.onMouseDrag = (event) ->
    console.log("Dragged Mouse")
