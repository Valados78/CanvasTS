type Point = {
    x: number;
    y: number;
  };
  
  type Size = {
    width: number;
    height: number;
  };
  
  type Rect = {
    position: Point; // координата центра прямоугольника
    size: Size;
  };
  
  type ConnectionPoint = {
    point: Point;
    angle: number; // угол в градусах
  };
  
  const dataConverter = (
    rect1: Rect, 
    rect2: Rect, 
    cPoint1: ConnectionPoint, 
    cPoint2: ConnectionPoint
  ): Point[] => {
    
    // Проверка на корректность точки подключения
    const isPointOnEdge = (rect: Rect, point: Point): boolean => {
      const { position, size } = rect;
      const { x, y } = point;
      const left = position.x - size.width / 2;
      const right = position.x + size.width / 2;
      const top = position.y - size.height / 2;
      const bottom = position.y + size.height / 2;
  
      return (x === left || x === right) && (y >= top && y <= bottom) ||
             (y === top || y === bottom) && (x >= left && x <= right);
    };
  
    if (!isPointOnEdge(rect1, cPoint1.point) || !isPointOnEdge(rect2, cPoint2.point)) {
      throw new Error("Точки соединения должны лежать на гранях");
    }
  
    // Проверка угла подключения
    const isAngleValid = (angle: number): boolean => {
      return angle % 90 === 0; // Угол должен быть кратен 90
    };
  
    if (!isAngleValid(cPoint1.angle) || !isAngleValid(cPoint2.angle)) {
      throw new Error("Углы должны быть перпендикулярны и направлены наружу");
    }
  
    // Вычисление точек для ломаной линии
    const points: Point[] = [];
    
    // Добавляем первую точку подключения
    points.push(cPoint1.point);
  
    // Логика для вычисления следующей точки на основе углов и размеров прямоугольников
    const getOffset = (angle: number): Point => {
      const radians = angle * (Math.PI / 180);
      return { x: Math.cos(radians), y: Math.sin(radians) };
    };
  
    const offset1 = getOffset(cPoint1.angle);
    const offset2 = getOffset(cPoint2.angle);
  
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

  const drawCanvas = (rect1: Rect, rect2: Rect, points: Point[]) => {
  
    const canvas = document.createElement('canvas');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
  
    // Отрисовка первого прямоугольника
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    
    ctx.fillRect(
      rect1.position.x - rect1.size.width / 2,
      rect1.position.y - rect1.size.height / 2,
      rect1.size.width,
      rect1.size.height
    );
  
    
     // Отрисовка второго прямоугольника
     ctx.fillStyle = 'rgba(0,0,255,0.5)';
     
     ctx.fillRect(
       rect2.position.x - rect2.size.width / 2,
       rect2.position.y - rect2.size.height / 2,
       rect2.size.width,
       rect2.size.height
     );
  
    
     // Отрисовка ломаной линии
     ctx.strokeStyle = 'black';
     ctx.lineWidth = 2;
  
     ctx.beginPath();
     ctx.moveTo(points[0].x, points[0].y);
  
     for (let i = 1; i < points.length; i++) {
       ctx.lineTo(points[i].x, points[i].y);
     }
  
     ctx.stroke();
  };
  
// Пример использования функции и тесты
  const rect1: Rect = { position: { x: 100, y:100 }, size: { width:50, height:30 } };
  const rect2: Rect = { position: { x:300, y:220 }, size: { width:70, height:40 } };
  const connectionPoint1: ConnectionPoint = { point: { x:100, y:85 }, angle: -90 };
  const connectionPoint2: ConnectionPoint = { point: { x:300, y:240 }, angle: -90 };
  
  try {
     const pointsArray = dataConverter(rect1, rect2, connectionPoint1, connectionPoint2);
     drawCanvas(rect1, rect2, pointsArray);
  } catch (error) {
     console.error(error);
  }