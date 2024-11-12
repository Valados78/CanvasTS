var dataConverter = function (rect1, rect2, cPoint1, cPoint2) {
    // Проверка на корректность точки подключения
    var isPointOnEdge = function (rect, point) {
        var position = rect.position, size = rect.size;
        var x = point.x, y = point.y;
        var left = position.x - size.width / 2;
        var right = position.x + size.width / 2;
        var top = position.y - size.height / 2;
        var bottom = position.y + size.height / 2;
        return (x === left || x === right) && (y >= top && y <= bottom) ||
            (y === top || y === bottom) && (x >= left && x <= right);
    };
    if (!isPointOnEdge(rect1, cPoint1.point) || !isPointOnEdge(rect2, cPoint2.point)) {
        throw new Error("Точки соединения должны лежать на гранях");
    }
    // Проверка угла подключения
    var isAngleValid = function (angle) {
        return angle % 90 === 0; // Угол должен быть кратен 90
    };
    if (!isAngleValid(cPoint1.angle) || !isAngleValid(cPoint2.angle)) {
        throw new Error("Углы должны быть перпендикулярны и направлены наружу");
    }
    // Вычисление точек для ломаной линии
    var points = [];
    // Добавляем первую точку подключения
    points.push(cPoint1.point);
    // Логика для вычисления следующей точки на основе углов и размеров прямоугольников
    var getOffset = function (angle) {
        var radians = angle * (Math.PI / 180);
        return { x: Math.cos(radians), y: Math.sin(radians) };
    };
    var offset1 = getOffset(cPoint1.angle);
    var offset2 = getOffset(cPoint2.angle);
    // Находим точки обхода прямоугольников
    points.push({
        x: cPoint1.point.x + offset1.x * Math.max(rect1.size.width, rect1.size.height),
        y: cPoint1.point.y + offset1.y * Math.max(rect1.size.width, rect1.size.height),
    });
    points.push({
        x: cPoint2.point.x + offset2.x * Math.max(rect2.size.width, rect2.size.height),
        y: cPoint2.point.y + offset2.y * Math.max(rect2.size.width, rect2.size.height),
    });
    // Добавляем вторую точку подключения
    points.push(cPoint2.point);
    return points;
};
var drawCanvas = function (rect1, rect2, points) {
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    // Отрисовка первого прямоугольника
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.fillRect(rect1.position.x - rect1.size.width / 2, rect1.position.y - rect1.size.height / 2, rect1.size.width, rect1.size.height);
    // Отрисовка второго прямоугольника
    ctx.fillStyle = 'rgba(0,0,255,0.5)';
    ctx.fillRect(rect2.position.x - rect2.size.width / 2, rect2.position.y - rect2.size.height / 2, rect2.size.width, rect2.size.height);
    // Отрисовка ломаной линии
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
};
// Пример использования функции и тесты
var rect1 = { position: { x: 100, y: 100 }, size: { width: 50, height: 30 } };
var rect2 = { position: { x: 300, y: 220 }, size: { width: 70, height: 40 } };
var connectionPoint1 = { point: { x: 100, y: 85 }, angle: -90 };
var connectionPoint2 = { point: { x: 300, y: 200 }, angle: -90 };
try {
    var pointsArray = dataConverter(rect1, rect2, connectionPoint1, connectionPoint2);
    drawCanvas(rect1, rect2, pointsArray);
}
catch (error) {
    console.error(error);
}
