var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        type: 'Path.Circle',
        tolerance: 1
    };

    var eventData = {"1988": {"total": 739, "location": "Seoul, South Korea", "total_countries": 159, "medal_countries": 52},
                              "1992": {"total": 815, "location": "Barcelona, Spain", "total_countries": 169, "medal_countries": 64},
                              "1996": {"total": 842, "location": "Atlanta, USA", "total_countries": 197, "medal_countries": 79},
                              "2000": {"total": 927, "location": "Sydney, Australia", "total_countries": 200, "medal_countries": 80},
                              "2004": {"total": 930, "location": "Athens, Greece", "total_countries": 201, "medal_countries": 74},
                              "2008": {"total": 958, "location": "Beijing, China", "total_countries": 204, "medal_countries": 86}};

    var olympicEvents = [];
    var info, medals; //Text Info
    var currentNode = null;
    var initialState = true;
    var eventInfoPaths = [];
    var yLabels = [];

    //Event class
    var OlympicEvent = (function() {
      function OlympicEvent(year, color, nodes, xPosition, group, total, location, total_countries, medal_countries) {
        this.year = year;
        this.color = color;
        this.nodes = nodes;
        this.xPosition = xPosition;
        this.group = group;
        this.exploded = false; //Initial state, all countries will be grouped together
        key = year.toString();

        this.total = eventData[key]["total"];
        this.location = eventData[key]["location"];
        this.total_countries = eventData[key]["total_countries"];
        this.medal_countries = eventData[key]["medal_countries"];
        // _.each(this.nodes, function(n){ this.group.addChild(n.circle) });
      }

      OlympicEvent.prototype.initialDraw = function() {
        drawInitialCircles(this.nodes, this.xPosition, this.color, this.year);
        //add to group
        //_.each(this.nodes, function(n){ this.group.addChild(n.circle) });
      };

      OlympicEvent.prototype.infoDraw = function() {
        drawEventInfo(this);
      }

      return OlympicEvent;
    })();

    //Node class
    var Node = Base.extend({
      initialize: function(name, gold, silver, bronze, gdp, year) {
        this.name = name;
        this.gold = gold;
        this.silver = silver;
        this.bronze = bronze;
        this.gdp = gdp;
        this.year = year;
        this.circle = null;
        this.radius = null;
        this.infoText = null;
        // this.compoundCircle = null;
      },

      explode: function() {
        info.content = this.name;
        medals.content = "Gold: " + this.gold + " Silver: " + this.silver + " Bronze: " + this.bronze + " GDP: " + this.gdp;
      }

    });

    setupInfo = function(x, y) {
      var countryStyle, medalsStyle;
      info = new PointText(new Point(x, y));
      countryStyle = new CharacterStyle();
      countryStyle.fontSize = 16;
      countryStyle.fillColor = 'white';
      info.characterStyle = countryStyle;
      medalsStyle = new CharacterStyle();
      medalsStyle.fontSize = 10;
      medalsStyle.fillColor = 'white';
      info.content = "";
      medals = new PointText(new Point(x, y + 20));
      medals.characterStyle = medalsStyle;
      medals.content = "";
      // instructions = new PointText(new Point(x + 700, y));
      // instructions.characterStyle = medalsStyle;
      // instructions.content = "Click on circle to see history"
    }

    clearInfo = function() {
      info.content = "";
      medals.content = "";
    }

    drawLine = function(pointA, pointB, strokeWidth) {
      var line = new Path.Line(pointA, pointB);
      line.strokeColor = 'white';
      line.strokeWidth = strokeWidth;
    };

    drawAxes = function() {
      var origin, top;
      origin = new Point(50, 650);
      top = new Point(50, 50);
      this.drawLine(top, top.add([0, 600]), 1);
      this.drawLine(origin, origin.add([950, 0]), 1);
      gdpLabel = new PointText(new Point(40, 400));
      gdpLabel.fontSize = 10;
      gdpLabel.fillColor = 'white';
      gdpLabel.content = "GDP per Capita";
      gdpLabel.rotate(270);
    };

    drawGdpLabels = function() {
      _.each([10000, 20000, 30000, 40000, 50000, 60000], function(e) {
        yPoint = 650 - (e/100);
        point = new Point(40, yPoint);
        drawLine(point, point + [20, 0]);
        label = new PointText(point - [30, 5]);
        label.fontSize = 10;
        label.fillColor = 'white';
        label.content = e;
      });

    }

    //Checks if given point and radius will collide with any of already drawn circles
    //returns tolerance(distance) if collision, or false if no collision
    detectCollision = function(countries, point, size) {
      var closeCircle;
      closeCircle = _.find(countries, function(c){ return point.isClose(c.circle.position, size + c.radius); });
      if(closeCircle)
        return closeCircle.radius/2;
      else
        return false;
    }

    drawInitialCircles = function(countries, xPosition, color, year) {
      var circle, point, size, yPoint, colliding;
      _.each(countries, function(n) {
        size = n.gold + n.silver + n.bronze;
        size = size / 4;
        if (size < 1) {
          size = 2;
        } else if (size < 5) {
          size = size * 2;
        }
        point = new Point((Math.random() * 100) + xPosition, (Math.random() * 100) + 550);
        circle = new Path.Circle(point, size);
        circle.fillColor = color;
        n.circle = circle;
        n.radius = size;
        circle.visible = false;
      });
    };

    drawEventInfo = function(event) {
      point = new Point(event.xPosition + 50, 620);
      label = new PointText(point);
      label.fontSize = 20;
      label.fillColor = event.color;
      label.content = event.location;
      label.rotate(270);
      label1 = label.clone();
      label1.content = "Total countries: " + event.total_countries ;
      label1.fontSize = 12;
      label1.rotate(90);
      label1.position.y -= 380;
      label1.position.x -= 30;
      label5 = label1.clone();
      label5.content = "Medalist Countries: " + event.medal_countries;
      label5.position.y -= 20;
      label2 = label.clone();
      label2.content = event.year;
      label2.position.x += 25;
      label3 = label.clone();
      label3.fontSize = 10;
      label3.position.y += 60;
      label3.position.x -= 40;
      label3.rotate(90);
      label4 = label3.clone();
      label4.position.y += 20;
      label4.content = event.year;

      size =  (event.total)/20;
      c = new Path.Circle(point - [0, 300], size);
      c.fillColor = event.color;
      medalLabel = label1.clone();
      medalLabel.content = "Medals: " + event.total;
      medalLabel.position.y += 20;
      labelGroup = new Group([label, label1, label2, c, label5, medalLabel]);
      eventInfoPaths.push(labelGroup);
      secondGroup = new Group([label3, label4]);
      secondGroup.visible = false;
      yLabels.push(secondGroup);
    }

    moveLabels = function() {
      _.each(eventInfoPaths, function(n){ n.visible = false; } );
      _.each(yLabels, function(n){ n.visible = true; } );
    }

    drawTraces = function(countries) {
      countries = _.sortBy(countries, function(c){ return c.year; });
      var path = new Path();
      path.strokeColor = 'white';
      var first = _.first(countries);
      var last = _.last(countries);
      path.add(first.circle.position);
      i = 1;
      _.each(countries, function(c){
        if (c != first) {
          nextCountry = countries[i+1];
          if (nextCountry) {
            path.curveTo(c.circle.position, nextCountry.circle.position);
          }
          i++;
        }
        path.smooth();
        path.visible = false;
        c.infoText.visible = true;
      });

    }

    computeInfo = function(countries, year) {
      var prevEvent, tinfo;
      prevEvent = _.find(olympicEvents, function(e){ return (e.year == (year - 4)); });
      _.each(countries, function(n) {
        tInfo = new PointText(n.circle.position + [n.radius, 0]);
        tInfo.fontSize = 10;

        if (prevEvent) {
          prevNode = _.find(prevEvent.nodes, function(c){ return (c.name == n.name); });
          if (prevNode) {
            diff = (n.gold + n.silver + n.bronze) - (prevNode.gold + prevNode.silver + prevNode.bronze);
            tInfo.content = "( " + diff + " , " + (n.gdp - prevNode.gdp) + " ) ";
            if (diff >= 0) {
              tInfo.fillColor = 'green';
            } else {
              tInfo.fillColor = 'red';
            }
          } else {
            tInfo.content = "0";
          }

        }
        tInfo.visible = false;
        n.infoText = tInfo;

      });
    }

    //Moves nodes to its proper position based in GDP value
    explodeNodes = function() {
      var colliding;
      // var allNodes = _.map(olympicEvents, function(event){ return event.nodes; });
      // allNodes = _.flatten(allNodes);
      _.each(olympicEvents, function(e) {
        computeInfo(e.nodes, e.year);
        var drawnCountries = [];
        _.each(e.nodes, function(n) {
            yPoint = 650 - (n.gdp / 100);
            if (yPoint < 50) {
              yPoint = 50;
            }
            n.circle.position.x = e.xPosition;
            n.circle.position.y = yPoint;
            //detect if its colliding with another circle
            var colliding = false;
            var counter = 0;
            do {
              colliding = detectCollision(drawnCountries, n.circle.position, n.radius);
              if(colliding) {
                n.circle.position.x += 2*colliding;
              }
              counter++;
            } while (colliding || (counter <= 4))
            // colliding = detectCollision(drawnCountries, n.circle.position, n.radius);
            // if(colliding) {
            //   n.circle.position.x += 2*colliding;
            // }
            n.infoText.position = n.circle.position + [n.radius, 0];
            n.circle.visible = true;
            drawnCountries.push(n);
        });
      });
    }

    fetchData = function(year, xPosition, color) {
      $.ajax({
        url: "/countries?year=" + year,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          results = [];
          _.each(data, function(f) {
            results.push(new Node(f['name'], f['gold'], f['silver'], f['bronze'], f['gdp'], year));
          });
          var olympicEvent = new OlympicEvent(year, color, results, xPosition, new Group());
          olympicEvents.push(olympicEvent);
          olympicEvent.infoDraw();
          olympicEvent.initialDraw();
        }

      });
    }


    //Draw lines
    drawAxes();
    //Info setup
    setupInfo(100, 80);
    fetchData(1988, 50, 'green');
    fetchData(1992, 220, 'white');
    fetchData(1996, 390, 'orange');
    fetchData(2000, 560, 'teal');
    fetchData(2004, 730, 'yellow');
    fetchData(2008, 900, 'red');

    //drawYears([1988, 1992, 1996, 2000, 2004, 2008]);
    drawGdpLabels();

    function onMouseMove(event) {
      var hitResult = project.hitTest(event.point, hitOptions);
      var allNodes = _.map(olympicEvents, function(event){ return event.nodes; });
      allNodes = _.flatten(allNodes);
      var hitCountry;
      if (hitResult && hitResult.item) {
        matchingCountries = _.filter(allNodes, function(c) { return hitResult.item.position.isClose(c.circle.position, c.radius); });
        hitCountry = extractClosestNode(matchingCountries, hitResult);
      }
      if(hitCountry) {
        _.each(allNodes, function(k){
          if(k != hitCountry) {
            k.circle.opacity = 0.4;
          }
        });
        hitCountry.explode();
        currentNode = hitCountry;
      } else if (currentNode) {
        clearInfo();
        _.each(allNodes, function(n){ n.circle.opacity = 1; });
        currentNode = null;
      }
    }

    extractClosestNode = function(matchingCountries, hitResult) {
      country = _.first(matchingCountries);
      if (matchingCountries.length == 1) {
        return country;
      } else {
        distance = 300;
        _.each(matchingCountries, function(c) {
          d = c.circle.position.getDistance(hitResult.item.position);
          if (distance > d) {
            country = c;
            distance = d;
          }
        });
        return country;
      }
    }

    function onMouseUp(event) {
      if (currentNode) {
        var allNodes = _.map(olympicEvents, function(event){ return event.nodes; });
        allNodes = _.flatten(allNodes);
        _.each(allNodes, function(n) {
          n.circle.visible = true;
          n.infoText.visible = false;
        });
        currentNode = null;
      }
    }

    function onMouseDown(event) {
      if (initialState) {
        moveLabels();
        explodeNodes();
        initialState = false;
      } else {
        var hitResult = project.hitTest(event.point, hitOptions);
        var allNodes = _.map(olympicEvents, function(event){ return event.nodes; });
        allNodes = _.flatten(allNodes);
        var hitCountry;
        if (hitResult && hitResult.item) {
          matchingCountries = _.filter(allNodes, function(c) { return hitResult.item.position.isClose(c.circle.position, c.radius); });
          hitCountry = extractClosestNode(matchingCountries, hitResult);
        }

        if (hitCountry) {
          var connectedCountries = []
          _.each(allNodes, function(n) {
            if (n.name != hitCountry.name) {
              n.circle.visible = false;
            } else {
              connectedCountries.push(n);
            }
          });
          drawTraces(connectedCountries);
          currentNode = hitCountry;
        }
      }
    }
