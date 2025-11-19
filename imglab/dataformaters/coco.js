// imglab/dataformaters/coco.js
var cocoFormater = {
  // 1. HÀM ĐỌC FILE (IMPORT)
  fromCOCO: function (cocoData) {
    let labellingData = {},
      idNumber = 1000;

    let categories = [];
    if (cocoData.categories) {
      for (var i = 0; i < cocoData.categories.length; i++) {
        categories.push(cocoData.categories[i]);
      }
    }

    for (var image_i = 0; image_i < cocoData.images.length; image_i++) {
      let image = cocoData.images[image_i];
      labellingData[image.file_name] = {
        imagename: image.file_name,
        shapeIndex: 0,
        pointIndex: 0,
        featurePointSize: 3,
        attributes: [],
        tags: [],
        size: {
          height: image.height,
          width: image.width,
        },
        shapes: [],
        zoomScale: 1,
        defaultZoomScale: 1,
      };

      for (var annot_i = 0; annot_i < cocoData.annotations.length; annot_i++) {
        const annotation = cocoData.annotations[annot_i];

        if (annotation.image_id === image.id) {
          // Xử lý bbox mảng thành object
          if (Array.isArray(annotation.bbox)) {
            var bboxArr = annotation.bbox;
            annotation.bbox = {
              x: bboxArr[0],
              y: bboxArr[1],
              width: bboxArr[2],
              height: bboxArr[3],
              w: bboxArr[2], // Đảm bảo có cả w
              h: bboxArr[3], // Đảm bảo có cả h
              cx: bboxArr[0] + bboxArr[2] / 2,
              cy: bboxArr[1] + bboxArr[3] / 2,
            };
          }

          let id = "SvgjsRect" + idNumber,
            type = "rect",
            points = [
              annotation.bbox.x,
              annotation.bbox.y,
              annotation.bbox.w,
              annotation.bbox.h,
            ];

          // Tìm tên Category
          var catName = "uncategorized";
          var foundCat = categories.find((x) => x.id == annotation.category_id);
          if (foundCat) catName = foundCat.name;

          // Lấy nội dung OCR
          var ocrContent = annotation.label_name || "";

          labellingData[image.file_name].shapes.push({
            id: id,
            label: catName,
            attributes: [{ label: catName, value: ocrContent }],
            tags: [],
            type: type,
            bbox: annotation.bbox,
            points: points,
            featurePoints: [],
            category: catName,
          });
          idNumber++;
        }
      }
    }

    return labellingData;
  },

  // 2. HÀM XUẤT FILE (EXPORT) - ĐÃ SỬA LỖI NULL
  toCOCO: function (labellingData) {
    var categories = [];
    var cocoData = {
      images: [],
      annotations: [],
      categories: [],
    };
    var images = Object.keys(labellingData);
    var annotationId = 1;

    for (var image_i = 0; image_i < images.length; image_i++) {
      var imageName = images[image_i];
      var imgData = labellingData[imageName];

      cocoData.images.push({
        file_name: imageName,
        height: imgData.size.height,
        width: imgData.size.width,
        id: image_i + 1,
      });

      if (imgData.shapes) {
        for (var shape_i = 0; shape_i < imgData.shapes.length; shape_i++) {
          var shape = imgData.shapes[shape_i];

          var categoryName = shape.label || "uncategorized";
          var ocrText = "";

          if (shape.attributes && shape.attributes.length > 0) {
            categoryName = shape.attributes[0].label || categoryName;
            ocrText = shape.attributes[0].value || "";
          }

          var catIndex = categories.indexOf(categoryName);
          if (catIndex === -1) {
            categories.push(categoryName);
            catIndex = categories.length - 1;
          }

          // --- SỬA LỖI TẠI ĐÂY: Ưu tiên lấy w, h ---
          var x = shape.bbox.x;
          var y = shape.bbox.y;
          // Store lưu là w, h. Một số chỗ cũ có thể là width, height. Lấy cái nào tồn tại.
          var w =
            typeof shape.bbox.w !== "undefined"
              ? shape.bbox.w
              : shape.bbox.width;
          var h =
            typeof shape.bbox.h !== "undefined"
              ? shape.bbox.h
              : shape.bbox.height;

          // Đảm bảo không bị null/undefined để tránh lỗi tính toán
          if (w === undefined || w === null) w = 0;
          if (h === undefined || h === null) h = 0;

          // Tính toán Segmentation (4 điểm của hình chữ nhật)
          // [x_top_left, y_top_left, x_top_right, y_top_right, x_bottom_right, y_bottom_right, x_bottom_left, y_bottom_left]
          var segmentation = [
            [
              x,
              y, // Top-Left
              x + w,
              y, // Top-Right
              x + w,
              y + h, // Bottom-Right
              x,
              y + h, // Bottom-Left
            ],
          ];

          // Tính toán bbox_norm (Chuẩn hóa 0-1)
          var imgW = imgData.size.width;
          var imgH = imgData.size.height;

          // Tránh chia cho 0
          if (imgW === 0) imgW = 1;
          if (imgH === 0) imgH = 1;

          var bbox_norm = [
            x / imgW, // x_min
            y / imgH, // y_min
            (x + w) / imgW, // x_max
            (y + h) / imgH, // y_max
          ];

          cocoData.annotations.push({
            segmentation: segmentation,
            image_id: image_i + 1,
            bbox: [x, y, w, h],
            category_id: catIndex + 1,
            id: annotationId++,
            label_name: ocrText,
            bbox_norm: bbox_norm,
          });
        }
      }
    }

    for (var i = 0; i < categories.length; i++) {
      cocoData.categories.push({
        id: i + 1,
        name: categories[i],
      });
    }

    return cocoData;
  },
};

function calcArea(coords) {
  var area = 0;
  var numCoords = coords.length;
  for (var i = 0; i < numCoords; i += 2) {
    var nexti = (i + 2) % numCoords;
    area += coords[i] * coords[nexti + 1] - coords[i + 1] * coords[nexti];
  }
  return Math.abs(area / 2);
}
