// imglab/js/store.js
// Biến toàn cục chứa dữ liệu gán nhãn
var labellingData = {};

/**
 * Thêm ảnh vào kho dữ liệu khi tải lên
 */
function addImgToStore(imgname, size) {
  if (!labellingData[imgname]) {
    labellingData[imgname] = {
      imagename: imgname,
      size: {
        width: size.width,
        height: size.height,
      },
      shapes: [],
      attributes: [], // Dữ liệu ảnh chung (nếu cần)
      tags: [],
      shapeIndex: 0, // Dùng để sinh ID mới khi copy/paste
    };
  }
}

/**
 * Thêm một hình (Shape) vào ảnh
 * Hàm này được gọi khi bạn vẽ xong một hình chữ nhật
 */
function attachShapeToImg(id, type, bbox, points) {
  // Tính toán tỷ lệ scale hiện tại để lưu tọa độ gốc (không phụ thuộc zoom)
  var scale = 1 / imgSelected.size.imageScale;

  var shape = {
    id: id,
    label: "", // Nhãn mặc định
    type: type, // 'rect'
    points: scaleShapePoints(points, scale), // Tọa độ chuẩn hóa
    bbox: scaleBbox(bbox, scale), // Khung bao chuẩn hóa
    attributes: [], // <--- QUAN TRỌNG: Mảng chứa dữ liệu OCR (Label, Value)
    tags: [],
    zoomScale: 1,
    defaultZoomScale: scale,
  };

  // Kiểm tra xem hình đã tồn tại chưa để tránh trùng lặp
  var currentImgShapes = labellingData[imgSelected.name].shapes;
  var existingShapeIndex = indexOf(currentImgShapes, "id", id);

  if (existingShapeIndex > -1) {
    currentImgShapes[existingShapeIndex] = shape;
  } else {
    currentImgShapes.push(shape);
  }

  return shape;
}

/**
 * Cập nhật tọa độ hình khi thay đổi kích thước hoặc di chuyển
 */
function updateShapeDetailInStore(shapeId, bbox, points) {
  var shapes = labellingData[imgSelected.name].shapes;
  var index = indexOf(shapes, "id", shapeId);

  if (index > -1) {
    var scale = 1 / imgSelected.size.imageScale;
    if (bbox) shapes[index].bbox = scaleBbox(bbox, scale);
    if (points) shapes[index].points = scaleShapePoints(points, scale);
  }
}

/**
 * Lấy thông tin hình dựa trên ID
 */
function getShape(shapeId) {
  return findInArray(labellingData[imgSelected.name].shapes, "id", shapeId);
}

/**
 * Xóa hình khỏi kho dữ liệu
 */
function detachShape(shapeId) {
  var shapes = labellingData[imgSelected.name].shapes;
  var index = indexOf(shapes, "id", shapeId);
  if (index > -1) {
    shapes.splice(index, 1);
  }
}

// --- CÁC HÀM HỖ TRỢ TÍNH TOÁN TỶ LỆ (SCALE) ---

function scaleShapePoints(points, scale) {
  if (!points) return [];
  // Nhân tất cả tọa độ với tỉ lệ scale (để lưu tọa độ gốc của ảnh)
  return points.map((val) => val * scale);
}

function scaleBbox(bbox, scale) {
  return {
    x: bbox.x * scale,
    y: bbox.y * scale,
    w: bbox.w * scale,
    h: bbox.h * scale,
    cx: (bbox.cx || 0) * scale, // Tâm X
    cy: (bbox.cy || 0) * scale, // Tâm Y
  };
}

// --- CÁC HÀM TIỆN ÍCH TÌM KIẾM ---
// (Thường các hàm này nằm ở app.js, nhưng ta để đây dự phòng nếu app.js thiếu)

function findInArray(arr, property, val) {
  if (!arr) return null;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][property] === val) return arr[i];
  }
  return null;
}

function indexOf(arr, property, val) {
  if (!arr) return -1;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][property] === val) return i;
  }
  return -1;
}

// Các hàm Feature Point cũ (đã xóa nội dung để tránh lỗi nếu còn code nào gọi nhầm)
function updateFeaturePointInStore() {}
function attachPointToShape() {}
function detachPoint() {}
function detachPointByIndex() {}
