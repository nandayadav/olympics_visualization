paper.install(window); //This registers paper scope globally
window.paperCoffee = function (func) {
  var canvas = document.getElementById('myCanvas');
  paper.setup(canvas);
  func.call(paper);
};