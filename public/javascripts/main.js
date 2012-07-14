/* DO NOT MODIFY. This file was compiled Sat, 14 Jul 2012 05:04:47 GMT from
 * /Users/nandayadav/Documents/personal/competitions/olympics/public/coffeescripts/main.coffee
 */

(function() {
  var DrawingUtility, Node, OlympicEvent;

  OlympicEvent = (function() {

    function OlympicEvent(year, color, nodes) {
      this.year = year;
      this.color = color;
      this.nodes = nodes;
    }

    return OlympicEvent;

  })();

  Node = (function() {

    function Node(name, gold, silver, bronze, gdp, year, circle, radius) {
      this.name = name;
      this.gold = gold;
      this.silver = silver;
      this.bronze = bronze;
      this.gdp = gdp;
      this.year = year;
      this.circle = circle;
      this.radius = radius;
    }

    Node.prototype.displayInfo = function() {};

    Node.prototype.moveToYear = function(year) {};

    return Node;

  })();

  DrawingUtility = (function() {

    function DrawingUtility(p) {
      var countryStyle, medalsStyle;
      this.p = p;
      this.info = new this.p.PointText(new this.p.Point(900, 100));
      countryStyle = new this.p.CharacterStyle();
      countryStyle.fontSize = 16;
      countryStyle.fillColor = 'white';
      this.info.characterStyle = countryStyle;
      medalsStyle = new this.p.CharacterStyle();
      medalsStyle.fontSize = 10;
      medalsStyle.fillColor = 'white';
      this.info.content = "";
      this.medals = new this.p.PointText(new this.p.Point(900, 120));
      this.medals.characterStyle = medalsStyle;
      this.medals.content = "";
    }

    DrawingUtility.prototype.explode = function(node) {
      this.info.content = node.name;
      return this.medals.content = "Gold: " + node.gold + " Silver: " + node.silver + " Bronze: " + node.bronze;
    };

    DrawingUtility.prototype.clearText = function() {
      this.info.content = '';
      return this.medals.content = '';
    };

    DrawingUtility.prototype.drawLine = function(pointA, pointB, strokeWidth) {
      var line;
      line = new this.p.Path.Line(pointA, pointB);
      line.strokeColor = 'white';
      line.strokeWidth = strokeWidth;
      return line.smooth();
    };

    DrawingUtility.prototype.drawAxes = function() {
      var origin, raster, top;
      origin = new this.p.Point(50, 650);
      top = new this.p.Point(50, 50);
      this.drawLine(top, top.add([0, 600]), 1);
      this.drawLine(origin, origin.add([800, 0]), 1);
      raster = new this.p.Raster('2008');
      return raster.position = new this.p.Point(100, 680);
    };

    DrawingUtility.prototype.drawTraces = function(nodes) {
      var existingPosition, n, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        existingPosition = n.circle.position;
        n.circle.position.x += 100;
        n.circle.position.y -= Math.random() * 10;
        _results.push(this.drawLine(existingPosition, n.circle.position, n.radius / 2));
      }
      return _results;
    };

    DrawingUtility.prototype.drawCircles = function(nodes, xPosition, color) {
      var circle, maxPoint, n, point, size, yPoint, _i, _len, _results;
      maxPoint = new this.p.Point(100, 600);
      _results = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        size = n.gold + n.silver + n.bronze;
        size = size / 4;
        if (size < 1) {
          size = 2;
        } else if (size < 5) {
          size = size * 2;
        }
        point = new this.p.Point((Math.random() * 100) + xPosition, 0);
        yPoint = 650 - (n.gdp / 100);
        if (yPoint < 50) {
          yPoint = 50;
        }
        point.y = yPoint;
        circle = new this.p.Path.Circle(point, size);
        circle.fillColor = color;
        n.circle = circle;
        n.radius = size;
        _results.push(console.log("name: " + n.name + " size: " + n.gdp));
      }
      return _results;
    };

    return DrawingUtility;

  })();

  paperCoffee(function() {
    alert("here..");
    var hitOptions, nodes, olympicEvents, tool, u;
    nodes = [];
    olympicEvents = [];
    u = new DrawingUtility(paper);
    u.drawAxes();
    hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      type: 'Path.Circle',
      tolerance: 1
    };
    $.ajax({
      url: '/countries',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        var f, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          f = data[_i];
          nodes.push(new Node(f['name'], parseInt(f['gold']), parseInt(f['silver']), parseInt(f['bronze']), parseInt(f['gdp']), 2008, null, null));
        }
        olympicEvents.push(new OlympicEvent(2008, 'yellow', nodes));
        olympicEvents.push(new OlympicEvent(2004, 'white', nodes));
        olympicEvents.push(new OlympicEvent(2000, 'orange', nodes));
        u.drawCircles(nodes, 100, 'yellow');
        u.drawCircles(nodes, 200, 'white');
        u.drawCircles(nodes, 300, 'orange');
        u.drawCircles(nodes, 400, 'green');
        u.drawCircles(nodes, 500, 'teal');
        u.drawCircles(nodes, 600, 'blue');
        u.drawCircles(nodes, 700, 'orange');
        return paper.view.draw();
      }
    });
    tool = new this.Tool;
    tool.onMouseDown = function(event) {
      console.log("Mouse is down dude");
      return u.drawTraces(nodes);
    };
    tool.onMouseMove = function(event) {
      var hitPoint, hitResult, n, y, _i, _j, _k, _len, _len1, _len2, _results;
      console.log("Moved mouse");
      hitResult = paper.project.hitTest(event.point, hitOptions);
      if (hitResult && hitResult.item) {
        console.log("Found a hit" + hitResult.item.position);
        hitPoint = hitResult.item.position;
        _results = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          n = nodes[_i];
          if (hitPoint.isClose(n.circle.position, n.radius)) {
            for (_j = 0, _len1 = nodes.length; _j < _len1; _j++) {
              y = nodes[_j];
              if (y !== n) {
                y.circle.opacity = 0.5;
              }
            }
            _results.push(u.explode(n));
          } else {
            _results.push(console.log("Missed for: " + n.name));
          }
        }
        return _results;
      } else {
        console.log("Clearing text..");
        for (_k = 0, _len2 = nodes.length; _k < _len2; _k++) {
          y = nodes[_k];
          y.circle.opacity = 1;
        }
        return u.clearText();
      }
    };
    return tool.onMouseDrag = function(event) {
      return console.log("Dragged Mouse");
    };
  });

}).call(this);
